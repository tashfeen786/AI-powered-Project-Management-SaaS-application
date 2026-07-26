from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.background_job import BackgroundJob
import uuid
from typing import Sequence

class JobRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_org(self, org_id: uuid.UUID) -> Sequence[BackgroundJob]:
        query = select(BackgroundJob).where(
            BackgroundJob.organization_id == org_id,
            BackgroundJob.is_deleted == False
        ).order_by(desc(BackgroundJob.created_at))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, job_id: uuid.UUID, org_id: uuid.UUID) -> BackgroundJob | None:
        result = await self.db.execute(select(BackgroundJob).where(
            BackgroundJob.id == job_id, 
            BackgroundJob.organization_id == org_id,
            BackgroundJob.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, job: BackgroundJob) -> BackgroundJob:
        self.db.add(job)
        await self.db.commit()
        await self.db.refresh(job)
        return job
        
    async def update(self, job: BackgroundJob) -> BackgroundJob:
        await self.db.commit()
        await self.db.refresh(job)
        return job
        
    async def delete(self, job: BackgroundJob) -> None:
        job.is_deleted = True
        await self.db.commit()
