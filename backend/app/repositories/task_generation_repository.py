from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.task_generation import TaskGeneration
import uuid
from typing import Sequence

class TaskGenerationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project(self, org_id: uuid.UUID, project_id: uuid.UUID) -> Sequence[TaskGeneration]:
        query = select(TaskGeneration).where(
            TaskGeneration.project_id == project_id, 
            TaskGeneration.organization_id == org_id,
            TaskGeneration.is_deleted == False
        ).order_by(desc(TaskGeneration.created_at))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, gen_id: uuid.UUID, org_id: uuid.UUID) -> TaskGeneration | None:
        result = await self.db.execute(select(TaskGeneration).where(
            TaskGeneration.id == gen_id, 
            TaskGeneration.organization_id == org_id,
            TaskGeneration.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, generation: TaskGeneration) -> TaskGeneration:
        self.db.add(generation)
        await self.db.commit()
        await self.db.refresh(generation)
        return generation
        
    async def update(self, generation: TaskGeneration) -> TaskGeneration:
        await self.db.commit()
        await self.db.refresh(generation)
        return generation
