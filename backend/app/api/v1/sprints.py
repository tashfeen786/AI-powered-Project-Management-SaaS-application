from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any
import uuid
from app.db.session import get_db
from app.schemas.sprint import SprintResponse, SprintCreate, SprintUpdate, GenerateSprintPlanRequest
from app.services.sprint_service import SprintService
from app.services.rbac_service import RBACService, Permission
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response, paginated_response
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

@router.post("/projects/{project_id}/sprints/generate", response_model=StandardResponse[Any])
async def generate_sprint_plan(
    project_id: uuid.UUID,
    request: GenerateSprintPlanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    sprint_service = SprintService(db)
    
    result = await sprint_service.generate_sprint_plan(org_id, request)
    return success_response(data=result, message="Sprint plan generated successfully")

@router.get("/projects/{project_id}/sprints", response_model=StandardResponse)
async def list_sprints(
    project_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    sprint_service = SprintService(db)
    
    items, total = await sprint_service.get_sprints(org_id, project_id, page, limit, status)
    
    return paginated_response(
        items=[SprintResponse.model_validate(item).model_dump() for item in items],
        total=total,
        page=page,
        limit=limit,
        message="Sprints retrieved"
    )

@router.post("/sprints", response_model=StandardResponse[SprintResponse])
async def create_sprint(
    sprint_in: SprintCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    sprint_service = SprintService(db)
    
    sprint = await sprint_service.create_sprint(org_id, sprint_in)
    return success_response(data=SprintResponse.model_validate(sprint), message="Sprint created")

@router.get("/sprints/{id}", response_model=StandardResponse[SprintResponse])
async def get_sprint(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    sprint_service = SprintService(db)
    
    sprint = await sprint_service.get_sprint(org_id, id)
    return success_response(data=SprintResponse.model_validate(sprint), message="Sprint retrieved")

@router.patch("/sprints/{id}", response_model=StandardResponse[SprintResponse])
async def update_sprint(
    id: uuid.UUID,
    update_in: SprintUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    sprint_service = SprintService(db)
    
    sprint = await sprint_service.update_sprint(org_id, id, update_in)
    return success_response(data=SprintResponse.model_validate(sprint), message="Sprint updated")

@router.delete("/sprints/{id}", response_model=StandardResponse)
async def delete_sprint(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    sprint_service = SprintService(db)
    
    await sprint_service.delete_sprint(org_id, id)
    return success_response(message="Sprint deleted")
