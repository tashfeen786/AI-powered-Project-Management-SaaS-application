from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectStatistics
from app.repositories.project_repository import ProjectRepository
from app.repositories.organization_repository import OrganizationRepository
from app.models.project import Project
from typing import Sequence, Tuple, Optional
import uuid
import random
from app.services.activity_service import ActivityService
import structlog

logger = structlog.get_logger()

class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.project_repo = ProjectRepository(db)
        self.org_repo = OrganizationRepository(db)
        
    async def _check_permission(self, user_id: uuid.UUID, org_id: uuid.UUID, require_admin: bool = False):
        role = await self.org_repo.get_user_role(user_id, org_id)
        logger.info("Project auth check", user_id=str(user_id), org_id=str(org_id), membership_found=bool(role), role=role.role if role else None, require_admin=require_admin)
        if not role:
            logger.warning("Project auth check failed: User not in org", user_id=str(user_id))
            raise HTTPException(status_code=403, detail="User does not belong to this organization")
        if require_admin and role.role not in ["owner", "admin"]:
            logger.warning("Project auth check failed: Need admin", user_id=str(user_id), role=role.role)
            raise HTTPException(status_code=403, detail="Not enough permissions")
        logger.info("Project auth check passed", user_id=str(user_id))

    async def get_projects(
        self, 
        user_id: uuid.UUID,
        org_id: uuid.UUID,
        page: int = 1,
        limit: int = 10,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        sort: str = "newest"
    ) -> Tuple[Sequence[Project], int]:
        await self._check_permission(user_id, org_id)
        return await self.project_repo.get_by_org_id_paginated(org_id, page, limit, status, priority, search, sort)
        
    async def get_project(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID) -> Project:
        await self._check_permission(user_id, org_id)
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    async def get_recent_projects(self, user_id: uuid.UUID, org_id: uuid.UUID, limit: int = 5) -> Sequence[Project]:
        await self._check_permission(user_id, org_id)
        return await self.project_repo.get_recent_projects(org_id, limit)

    async def get_statistics(self, user_id: uuid.UUID, org_id: uuid.UUID) -> ProjectStatistics:
        await self._check_permission(user_id, org_id)
        stats = await self.project_repo.get_statistics(org_id)
        return ProjectStatistics(**stats)

    async def create_project(self, user_id: uuid.UUID, org_id: uuid.UUID, project_in: ProjectCreate) -> Project:
        await self._check_permission(user_id, org_id, require_admin=True) # Assuming members can't create projects, or adjust as needed
        
        # Check duplicate name
        existing = await self.project_repo.get_by_name_and_org(project_in.name, org_id)
        if existing:
            raise HTTPException(status_code=409, detail="Project name already exists in this organization")

        # Generate a mock key like PRJ-123
        key_prefix = "".join([c for c in project_in.name if c.isalpha()][:3]).upper()
        if len(key_prefix) == 0:
            key_prefix = "PRJ"
        key = f"{key_prefix}-{random.randint(100,999)}"
        
        project = Project(
            name=project_in.name,
            key=key,
            description=project_in.description,
            organization_id=org_id,
            status=project_in.status,
            priority=project_in.priority,
            progress=project_in.progress,
            start_date=project_in.start_date,
            end_date=project_in.end_date,
            created_by_id=user_id
        )
        
        created = await self.project_repo.create(project)
        
        act_service = ActivityService(self.db)
        await act_service.log_activity(
            project_id=created.id,
            actor_id=user_id,
            type="project_created",
            description=f"Created project '{project.name}'",
            org_id=org_id
        )
        
        return created

    async def update_project(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID, project_in: ProjectUpdate) -> Project:
        await self._check_permission(user_id, org_id, require_admin=True)
        
        project = await self.get_project(user_id, org_id, project_id)
        
        update_data = project_in.model_dump(exclude_unset=True)
        
        if "name" in update_data and update_data["name"] != project.name:
            existing = await self.project_repo.get_by_name_and_org(update_data["name"], org_id)
            if existing:
                raise HTTPException(status_code=409, detail="Project name already exists")
                
        for field, value in update_data.items():
            setattr(project, field, value)
            
        updated = await self.project_repo.update(project)
        # Project Updated Activity Hook dispatched via Event Bus
        return updated
        
    async def delete_project(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID) -> None:
        await self._check_permission(user_id, org_id, require_admin=True)
        
        project = await self.get_project(user_id, org_id, project_id)
        await self.project_repo.delete(project)
        # Project Deleted Activity Hook dispatched via Event Bus
