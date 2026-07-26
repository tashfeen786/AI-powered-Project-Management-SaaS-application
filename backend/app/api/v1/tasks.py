from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from app.db.session import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskMove, TaskAssign, TaskResponse
from app.services.task_service import TaskService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response, paginated_response

router = APIRouter()

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

@router.get("/projects/{project_id}/tasks", response_model=StandardResponse)
async def list_project_tasks(
    project_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=500),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[uuid.UUID] = None,
    sprint_id: Optional[uuid.UUID] = None,
    search: Optional[str] = None,
    sort: str = "manual",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    items, total = await task_service.get_tasks(
        user_id=current_user.id,
        org_id=org_id,
        project_id=project_id,
        page=page,
        limit=limit,
        status=status,
        priority=priority,
        assignee_id=assignee_id,
        sprint_id=sprint_id,
        search=search,
        sort=sort
    )
    
    return paginated_response(
        items=[TaskResponse.model_validate(t).model_dump() for t in items],
        total=total,
        page=page,
        limit=limit,
        message="Tasks retrieved"
    )

@router.get("/tasks/{id}", response_model=StandardResponse[TaskResponse])
async def get_task(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    task = await task_service.get_task(current_user.id, org_id, id)
    return success_response(data=TaskResponse.model_validate(task), message="Task retrieved")

@router.post("/tasks", response_model=StandardResponse[TaskResponse])
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    task = await task_service.create_task(current_user.id, org_id, task_in)
    return success_response(data=TaskResponse.model_validate(task), message="Task created")

@router.patch("/tasks/{id}", response_model=StandardResponse[TaskResponse])
async def update_task(
    id: uuid.UUID,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    task = await task_service.update_task(current_user.id, org_id, id, task_in)
    return success_response(data=TaskResponse.model_validate(task), message="Task updated")

@router.patch("/tasks/{id}/move", response_model=StandardResponse[TaskResponse])
async def move_task(
    id: uuid.UUID,
    move_in: TaskMove,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    task = await task_service.move_task(current_user.id, org_id, id, move_in)
    return success_response(data=TaskResponse.model_validate(task), message="Task moved")

@router.patch("/tasks/{id}/assign", response_model=StandardResponse[TaskResponse])
async def assign_task(
    id: uuid.UUID,
    assign_in: TaskAssign,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    task = await task_service.assign_task(current_user.id, org_id, id, assign_in)
    return success_response(data=TaskResponse.model_validate(task), message="Task assigned")

@router.delete("/tasks/{id}", response_model=StandardResponse)
async def delete_task(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    task_service = TaskService(db)
    await task_service.delete_task(current_user.id, org_id, id)
    return success_response(message="Task deleted")
