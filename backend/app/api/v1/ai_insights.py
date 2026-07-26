from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.ai_insight import AIInsightResponse, InsightResolveRequest, WorkloadResponse
from app.services.ai_insight_service import AIInsightService
from app.services.workload_service import WorkloadService
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

@router.post("/projects/{project_id}/insights/generate", response_model=StandardResponse[List[AIInsightResponse]])
async def generate_insights(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS) # Or specific GENERATE_INSIGHTS
    insight_service = AIInsightService(db)
    
    insights = await insight_service.generate_project_insights(org_id, project_id)
    return success_response(
        data=[AIInsightResponse.model_validate(i) for i in insights], 
        message="AI Insights generated"
    )

@router.get("/projects/{project_id}/insights", response_model=StandardResponse[List[AIInsightResponse]])
async def list_insights(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    insight_service = AIInsightService(db)
    
    insights = await insight_service.get_project_insights(org_id, project_id)
    return success_response(
        data=[AIInsightResponse.model_validate(i) for i in insights], 
        message="Active insights retrieved"
    )

@router.patch("/insights/{id}/resolve", response_model=StandardResponse[AIInsightResponse])
async def resolve_insight(
    id: uuid.UUID,
    request: InsightResolveRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    insight_service = AIInsightService(db)
    
    insight = await insight_service.resolve_insight(org_id, id, request.status)
    return success_response(data=AIInsightResponse.model_validate(insight), message=f"Insight marked as {request.status}")

@router.get("/projects/{project_id}/workload", response_model=StandardResponse[WorkloadResponse])
async def get_workload(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    workload_service = WorkloadService(db)
    
    workload = await workload_service.calculate_project_workload(org_id, project_id)
    return success_response(data=workload, message="Team workload analysis retrieved")
