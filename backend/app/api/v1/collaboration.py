from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
import uuid
import os
import shutil
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.models.reaction import Reaction
from app.models.task_watcher import TaskWatcher
from app.models.notification import Notification
from app.models.attachment import Attachment
from app.models.task import Task
from app.utils.response import StandardResponse, success_response
from app.core.websocket_manager import manager
from app.schemas.websocket import WsServerMessage
from datetime import datetime, UTC

router = APIRouter()

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

# ================================
# REACTIONS
# ================================
from pydantic import BaseModel
class ReactionCreate(BaseModel):
    emoji: str
    comment_id: uuid.UUID

@router.post("/reactions", response_model=StandardResponse)
async def toggle_reaction(
    req: ReactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    # Check if reaction exists
    result = await db.execute(
        select(Reaction).where(
            Reaction.comment_id == req.comment_id,
            Reaction.user_id == current_user.id,
            Reaction.emoji == req.emoji
        )
    )
    existing = result.scalar_one_or_none()
    
    # We need the project_id to broadcast
    from app.models.comment import Comment
    comment_result = await db.execute(select(Comment).where(Comment.id == req.comment_id))
    comment = comment_result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    task_result = await db.execute(select(Task).where(Task.id == comment.task_id))
    task = task_result.scalar_one_or_none()
    project_id = task.project_id if task else None

    if existing:
        await db.delete(existing)
        action = "reaction_removed"
    else:
        new_reaction = Reaction(
            emoji=req.emoji,
            comment_id=req.comment_id,
            user_id=current_user.id
        )
        db.add(new_reaction)
        action = "reaction_added"
        
    await db.commit()

    if project_id:
        await manager.broadcast_to_project(
            project_id,
            WsServerMessage(
                event=action,
                project_id=project_id,
                organization_id=org_id,
                timestamp=datetime.now(UTC),
                payload={"comment_id": str(req.comment_id), "emoji": req.emoji, "user_id": str(current_user.id)}
            )
        )

    return success_response(message=f"Reaction toggled")

# ================================
# WATCHERS
# ================================
class WatcherCreate(BaseModel):
    task_id: uuid.UUID

@router.post("/watchers", response_model=StandardResponse)
async def toggle_watcher(
    req: WatcherCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    result = await db.execute(
        select(TaskWatcher).where(
            TaskWatcher.task_id == req.task_id,
            TaskWatcher.user_id == current_user.id
        )
    )
    existing = result.scalar_one_or_none()
    
    task_result = await db.execute(select(Task).where(Task.id == req.task_id))
    task = task_result.scalar_one_or_none()
    project_id = task.project_id if task else None

    if existing:
        await db.delete(existing)
        action = "watcher_removed"
    else:
        watcher = TaskWatcher(task_id=req.task_id, user_id=current_user.id)
        db.add(watcher)
        action = "watcher_added"

    await db.commit()
    
    if project_id:
        await manager.broadcast_to_project(
            project_id,
            WsServerMessage(
                event=action,
                project_id=project_id,
                organization_id=org_id,
                timestamp=datetime.now(UTC),
                payload={"task_id": str(req.task_id), "user_id": str(current_user.id)}
            )
        )

    return success_response(message="Watcher toggled")

# ================================
# ATTACHMENTS
# ================================
@router.post("/tasks/{task_id}/attachments", response_model=StandardResponse)
async def upload_attachment(
    task_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    upload_dir = "uploads/attachments"
    os.makedirs(upload_dir, exist_ok=True)
    
    safe_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    attachment = Attachment(
        filename=file.filename,
        file_url=f"/api/v1/collaboration/attachments/{safe_filename}",
        file_size=os.path.getsize(file_path),
        content_type=file.content_type or "application/octet-stream",
        task_id=task_id,
        uploaded_by_id=current_user.id
    )
    db.add(attachment)
    await db.commit()
    
    task_result = await db.execute(select(Task).where(Task.id == task_id))
    task = task_result.scalar_one_or_none()
    if task:
        await manager.broadcast_to_project(
            task.project_id,
            WsServerMessage(
                event="attachment_uploaded",
                project_id=task.project_id,
                organization_id=org_id,
                timestamp=datetime.now(UTC),
                payload={"task_id": str(task_id)}
            )
        )

    return success_response(message="File uploaded successfully")

from fastapi.responses import FileResponse
@router.get("/attachments/{filename}")
async def get_attachment(filename: str):
    file_path = os.path.join("uploads/attachments", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# ================================
# NOTIFICATIONS
# ================================
@router.get("/notifications", response_model=StandardResponse)
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    )
    notifs = result.scalars().all()
    
    # Serialize manually for now
    data = []
    for n in notifs:
        data.append({
            "id": str(n.id),
            "title": n.title,
            "content": n.content,
            "type": n.type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat()
        })
        
    return success_response(data=data)

@router.patch("/notifications/{id}/read", response_model=StandardResponse)
async def mark_notification_read(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.execute(select(Notification).where(Notification.id == id, Notification.user_id == current_user.id))
    notif = result.scalar_one_or_none()
    if notif:
        notif.is_read = True
        await db.commit()
    return success_response(message="Notification marked read")
