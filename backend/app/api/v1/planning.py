from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.planning import PlanningResponse, PlanningUpdate, GeneratePlanningRequest
from app.services.planning_service import PlanningService
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

@router.post("/projects/{project_id}/planning/generate", response_model=StandardResponse[PlanningResponse])
async def generate_planning(
    project_id: uuid.UUID,
    request: GeneratePlanningRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.GENERATE_SPRINT_PLAN)
    plan_service = PlanningService(db)
    
    plan = await plan_service.generate_plan(current_user.id, org_id, project_id, request)
    return success_response(data=PlanningResponse.model_validate(plan), message="Sprint plan generated successfully")

@router.get("/projects/{project_id}/planning", response_model=StandardResponse)
async def list_plannings(
    project_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    plan_service = PlanningService(db)
    
    items, total = await plan_service.get_plannings(org_id, project_id, page, limit)
    
    return paginated_response(
        items=[PlanningResponse.model_validate(item).model_dump() for item in items],
        total=total,
        page=page,
        limit=limit,
        message="Sprint plans retrieved"
    )

@router.get("/planning/{id}", response_model=StandardResponse[PlanningResponse])
async def get_planning(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    plan_service = PlanningService(db)
    
    plan = await plan_service.get_planning(org_id, id)
    return success_response(data=PlanningResponse.model_validate(plan), message="Sprint plan retrieved")

@router.patch("/planning/{id}", response_model=StandardResponse[PlanningResponse])
async def update_planning(
    id: uuid.UUID,
    update_in: PlanningUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    plan_service = PlanningService(db)
    
    plan = await plan_service.update_planning(current_user.id, org_id, id, update_in)
    return success_response(data=PlanningResponse.model_validate(plan), message="Sprint plan updated")

@router.post("/planning/{id}/approve", response_model=StandardResponse[PlanningResponse])
async def approve_planning(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Depending on rules, maybe only owners/admins can approve
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    plan_service = PlanningService(db)
    
    plan = await plan_service.approve_planning(current_user.id, org_id, id)
    return success_response(data=PlanningResponse.model_validate(plan), message="Sprint plan approved and finalized")

@router.delete("/planning/{id}", response_model=StandardResponse)
async def delete_planning(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    plan_service = PlanningService(db)
    
    await plan_service.delete_planning(org_id, id)
    return success_response(message="Sprint plan deleted")
