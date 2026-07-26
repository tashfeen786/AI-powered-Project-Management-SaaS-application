from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.project_service import ProjectService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response

router = APIRouter()

@router.get("", response_model=StandardResponse[List[ProjectResponse]])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    project_service = ProjectService(db)
    projects = await project_service.get_projects(current_user.organization_id)
    return success_response(
        data=[ProjectResponse.model_validate(p) for p in projects], 
        message="Projects retrieved"
    )

@router.post("", response_model=StandardResponse[ProjectResponse])
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    project_service = ProjectService(db)
    project = await project_service.create_project(project_in, current_user.organization_id)
    return success_response(
        data=ProjectResponse.model_validate(project), 
        message="Project created"
    )
