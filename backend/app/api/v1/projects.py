from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectStatistics, QuickAction
from app.services.project_service import ProjectService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response, paginated_response

router = APIRouter()

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

@router.get("", response_model=StandardResponse)
async def list_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "newest",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    items, total = await project_service.get_projects(
        user_id=current_user.id,
        org_id=org_id,
        page=page,
        limit=limit,
        status=status,
        priority=priority,
        search=search,
        sort=sort
    )
    
    return paginated_response(
        items=[ProjectResponse.model_validate(p).model_dump() for p in items],
        total=total,
        page=page,
        limit=limit,
        message="Projects retrieved"
    )

@router.get("/recent", response_model=StandardResponse[List[ProjectResponse]])
async def get_recent_projects(
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    projects = await project_service.get_recent_projects(current_user.id, org_id, limit)
    return success_response(
        data=[ProjectResponse.model_validate(p) for p in projects], 
        message="Recent projects retrieved"
    )

@router.get("/statistics", response_model=StandardResponse[ProjectStatistics])
async def get_project_statistics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    stats = await project_service.get_statistics(current_user.id, org_id)
    return success_response(data=stats, message="Statistics retrieved")

@router.get("/quick-actions", response_model=StandardResponse[List[QuickAction]])
async def get_quick_actions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    # This might be dynamic in the future based on user activity. For now, mock it as requested by typical dashboard layouts.
    actions = [
        QuickAction(id="1", title="Create New Project", action="create_project"),
        QuickAction(id="2", title="Review Pending Approvals", action="review_approvals"),
        QuickAction(id="3", title="Generate Weekly Report", action="generate_report"),
    ]
    return success_response(data=actions, message="Quick actions retrieved")

@router.get("/{id}", response_model=StandardResponse[ProjectResponse])
async def get_project(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    project = await project_service.get_project(current_user.id, org_id, id)
    return success_response(data=ProjectResponse.model_validate(project), message="Project retrieved")

@router.post("", response_model=StandardResponse[ProjectResponse])
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    project = await project_service.create_project(current_user.id, org_id, project_in)
    return success_response(
        data=ProjectResponse.model_validate(project), 
        message="Project created"
    )

@router.patch("/{id}", response_model=StandardResponse[ProjectResponse])
async def update_project(
    id: uuid.UUID,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    project = await project_service.update_project(current_user.id, org_id, id, project_in)
    return success_response(data=ProjectResponse.model_validate(project), message="Project updated")

@router.delete("/{id}", response_model=StandardResponse)
async def delete_project(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    await project_service.delete_project(current_user.id, org_id, id)
    return success_response(message="Project deleted")

from pydantic import BaseModel
class AnalyzeProjectRequest(BaseModel):
    requirements: str

@router.post("/{id}/analyze", response_model=StandardResponse)
async def analyze_project(
    id: uuid.UUID,
    request: AnalyzeProjectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    # Enqueue celery task
    from app.tasks.orchestrator_tasks import run_ai_orchestrator
    
    run_ai_orchestrator.delay(
        project_id=str(id),
        org_id=str(org_id),
        user_id=str(current_user.id),
        requirements=request.requirements
    )
    
    return success_response(message="AI analysis pipeline started")
