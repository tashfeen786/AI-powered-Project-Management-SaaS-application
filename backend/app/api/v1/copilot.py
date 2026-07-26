from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.copilot import ConversationResponse, ConversationDetailResponse, MessageResponse, CreateConversationRequest, ChatRequest
from app.services.copilot_service import CopilotService
from app.services.rbac_service import RBACService, Permission
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from app.repositories.organization_repository import OrganizationRepository
from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.models.conversation import Conversation

router = APIRouter()

async def verify_org_and_role(current_user: User, db: AsyncSession, permission: Permission):
    if not current_user.current_organization_id:
        raise HTTPException(status_code=400, detail="No active organization context")
        
    org_repo = OrganizationRepository(db)
    role = await org_repo.get_user_role(current_user.id, current_user.current_organization_id)
    
    if not role or role.status != "accepted":
        raise HTTPException(status_code=403, detail="User is not an active member")
        
    if not RBACService.has_permission(role.role, permission):
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission.value}")
        
    return current_user.current_organization_id

@router.post("/conversations", response_model=StandardResponse[ConversationResponse])
async def create_conversation(
    request: CreateConversationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.USE_AI)
    copilot = CopilotService(db)
    
    conv = await copilot.create_conversation(current_user.id, org_id, request)
    return success_response(data=ConversationResponse.model_validate(conv), message="Conversation created")

@router.get("/conversations", response_model=StandardResponse[List[ConversationResponse]])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.USE_AI)
    copilot = CopilotService(db)
    
    convs = await copilot.get_conversations(current_user.id, org_id)
    return success_response(
        data=[ConversationResponse.model_validate(c) for c in convs], 
        message="Conversations retrieved"
    )

@router.get("/conversations/{id}", response_model=StandardResponse[ConversationDetailResponse])
async def get_conversation(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.USE_AI)
    copilot = CopilotService(db)
    
    # Eager load messages
    result = await db.execute(
        select(Conversation).options(selectinload(Conversation.messages))
        .where(Conversation.id == id, Conversation.organization_id == org_id, Conversation.created_by_id == current_user.id)
    )
    conv = result.scalar_one_or_none()
    
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    return success_response(data=ConversationDetailResponse.model_validate(conv), message="Conversation details retrieved")

@router.delete("/conversations/{id}", response_model=StandardResponse)
async def delete_conversation(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.USE_AI)
    copilot = CopilotService(db)
    
    await copilot.delete_conversation(id, org_id, current_user.id)
    return success_response(message="Conversation deleted")

@router.post("/chat", response_model=StandardResponse[MessageResponse])
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.USE_AI)
    copilot = CopilotService(db)
    
    msg = await copilot.send_message(current_user.id, org_id, request)
    return success_response(data=MessageResponse.model_validate(msg), message="AI Response generated")
