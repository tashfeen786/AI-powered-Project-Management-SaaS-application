from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.project import ProjectCreate
from app.repositories.project_repository import ProjectRepository
from app.models.project import Project
from typing import Sequence
import uuid
import random

class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.project_repo = ProjectRepository(db)
        
    async def get_projects(self, org_id: uuid.UUID) -> Sequence[Project]:
        return await self.project_repo.get_by_org_id(org_id)
        
    async def create_project(self, project_in: ProjectCreate, org_id: uuid.UUID) -> Project:
        # Generate a mock key like PRJ-123
        key = f"{project_in.name[:3].upper()}-{random.randint(100,999)}"
        
        project = Project(
            name=project_in.name,
            key=key,
            description=project_in.description,
            organization_id=org_id,
            status=project_in.status
        )
        return await self.project_repo.create(project)
