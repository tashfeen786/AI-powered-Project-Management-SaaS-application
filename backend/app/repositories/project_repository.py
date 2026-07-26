from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.project import Project
import uuid
from typing import Sequence

class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_org_id(self, org_id: uuid.UUID) -> Sequence[Project]:
        result = await self.db.execute(select(Project).where(Project.organization_id == org_id, Project.is_deleted == False))
        return result.scalars().all()
        
    async def get_by_id(self, project_id: uuid.UUID) -> Project | None:
        result = await self.db.execute(select(Project).where(Project.id == project_id, Project.is_deleted == False))
        return result.scalar_one_or_none()
        
    async def create(self, project: Project) -> Project:
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project
