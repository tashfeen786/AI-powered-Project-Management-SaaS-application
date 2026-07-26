from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.requirement import RequirementResponse, RequirementUpdate, GenerateRequirementRequest
from app.services.requirement_service import RequirementService
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

@router.post("/projects/{project_id}/requirements/generate", response_model=StandardResponse[RequirementResponse])
async def generate_requirement(
    project_id: uuid.UUID,
    request: GenerateRequirementRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.GENERATE_SRS)
    req_service = RequirementService(db)
    
    req = await req_service.generate_srs(current_user.id, org_id, project_id, request)
    return success_response(data=RequirementResponse.model_validate(req), message="SRS generated successfully")

@router.get("/projects/{project_id}/requirements", response_model=StandardResponse)
async def list_requirements(
    project_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    req_service = RequirementService(db)
    
    items, total = await req_service.get_requirements(org_id, project_id, page, limit)
    
    return paginated_response(
        items=[RequirementResponse.model_validate(item).model_dump() for item in items],
        total=total,
        page=page,
        limit=limit,
        message="Requirements retrieved"
    )

@router.get("/requirements/{id}", response_model=StandardResponse[RequirementResponse])
async def get_requirement(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    req_service = RequirementService(db)
    
    req = await req_service.get_requirement(org_id, id)
    return success_response(data=RequirementResponse.model_validate(req), message="Requirement retrieved")

@router.patch("/requirements/{id}", response_model=StandardResponse[RequirementResponse])
async def update_requirement(
    id: uuid.UUID,
    update_in: RequirementUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS) # Or a specific permission
    req_service = RequirementService(db)
    
    req = await req_service.update_requirement(current_user.id, org_id, id, update_in)
    return success_response(data=RequirementResponse.model_validate(req), message="Requirement updated")

@router.delete("/requirements/{id}", response_model=StandardResponse)
async def delete_requirement(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    req_service = RequirementService(db)
    
    await req_service.delete_requirement(org_id, id)
    return success_response(message="Requirement deleted")
