from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.job_repository import JobRepository
from app.models.background_job import BackgroundJob
from app.schemas.jobs import JobCreateRequest
from app.services.event_service import EventService
from datetime import datetime, UTC
import uuid
import structlog
from typing import Sequence

logger = structlog.get_logger()

class JobService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.job_repo = JobRepository(db)
        
    async def create_job(self, user_id: uuid.UUID, org_id: uuid.UUID, request: JobCreateRequest) -> BackgroundJob:
        job = BackgroundJob(
            job_type=request.job_type,
            status="Pending",
            project_id=request.project_id,
            organization_id=org_id,
            created_by_id=user_id,
            result=request.payload # Initial payload params stored here temporarily
        )
        
        created = await self.job_repo.create(job)
        logger.info("Background Job Created", job_id=str(created.id), job_type=request.job_type)
        return created

    async def get_jobs(self, org_id: uuid.UUID) -> Sequence[BackgroundJob]:
        return await self.job_repo.get_by_org(org_id)
        
    async def get_job(self, org_id: uuid.UUID, job_id: uuid.UUID) -> BackgroundJob:
        job = await self.job_repo.get_by_id(job_id, org_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return job
        
    async def delete_job(self, org_id: uuid.UUID, job_id: uuid.UUID) -> None:
        job = await self.get_job(org_id, job_id)
        await self.job_repo.delete(job)

    # --- Methods used by Celery Workers (or Mock Runner) ---
    async def start_job(self, job_id: uuid.UUID, org_id: uuid.UUID):
        job = await self.get_job(org_id, job_id)
        job.status = "Running"
        job.started_at = datetime.now(UTC)
        await self.job_repo.update(job)
        
        # Broadcast via WebSocket
        if job.project_id:
            await EventService.broadcast_project_update(org_id, job.project_id, {"job_id": str(job.id), "status": "Running"})

    async def update_progress(self, job_id: uuid.UUID, org_id: uuid.UUID, progress: int):
        job = await self.get_job(org_id, job_id)
        job.progress = min(100, max(0, progress))
        await self.job_repo.update(job)
        
        # Broadcast via WebSocket
        if job.project_id:
            await EventService.broadcast_project_update(org_id, job.project_id, {"job_id": str(job.id), "progress": job.progress})

    async def complete_job(self, job_id: uuid.UUID, org_id: uuid.UUID, result: dict = None):
        job = await self.get_job(org_id, job_id)
        job.status = "Completed"
        job.progress = 100
        job.completed_at = datetime.now(UTC)
        if result:
            job.result = result
        await self.job_repo.update(job)
        logger.info("Job Completed", job_id=str(job.id))
        
        if job.project_id:
            await EventService.broadcast_project_update(org_id, job.project_id, {"job_id": str(job.id), "status": "Completed"})
            
        # TODO: Trigger Notifications for specific job types

    async def fail_job(self, job_id: uuid.UUID, org_id: uuid.UUID, error: str):
        job = await self.get_job(org_id, job_id)
        job.status = "Failed"
        job.error = error
        job.completed_at = datetime.now(UTC)
        await self.job_repo.update(job)
        logger.error("Job Failed", job_id=str(job.id), error=error)
        
        if job.project_id:
            await EventService.broadcast_project_update(org_id, job.project_id, {"job_id": str(job.id), "status": "Failed"})
