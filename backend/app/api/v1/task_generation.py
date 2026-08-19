from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.task_generation import TaskGenerationResponse, GenerateTasksRequest
from app.services.task_generation_service import TaskGenerationService
from app.services.rbac_service import RBACService, Permission
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from app.repositories.organization_repository import OrganizationRepository
from fastapi import HTTPException

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

@router.post("/projects/{project_id}/tasks/generate", response_model=StandardResponse[TaskGenerationResponse])
async def generate_tasks(
    project_id: uuid.UUID,
    request: GenerateTasksRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS) # Or specific GENERATE_TASKS permission
    gen_service = TaskGenerationService(db)
    
    gen = await gen_service.generate_tasks(current_user.id, org_id, project_id, request)
    return success_response(data=TaskGenerationResponse.model_validate(gen), message="Task generation initiated")

@router.get("/projects/{project_id}/task-generation", response_model=StandardResponse[List[TaskGenerationResponse]])
async def list_task_generations(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    gen_service = TaskGenerationService(db)
    
    gens = await gen_service.get_generations_for_project(org_id, project_id)
    return success_response(
        data=[TaskGenerationResponse.model_validate(g) for g in gens],
        message="Task generations retrieved"
    )

from app.schemas.task_generation import TaskGenerationPayload

@router.put("/task-generation/{id}", response_model=StandardResponse[TaskGenerationResponse])
async def update_task_generation(
    id: uuid.UUID,
    payload: TaskGenerationPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    gen_service = TaskGenerationService(db)
    
    gen = await gen_service.update_generation(current_user.id, org_id, id, payload)
    return success_response(data=TaskGenerationResponse.model_validate(gen), message="Task generation updated")

@router.post("/task-generation/{id}/approve", response_model=StandardResponse[TaskGenerationResponse])
async def approve_task_generation(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    gen_service = TaskGenerationService(db)
    
    gen = await gen_service.approve_generation(current_user.id, org_id, id)
    return success_response(data=TaskGenerationResponse.model_validate(gen), message="Tasks successfully materialized to Kanban")
