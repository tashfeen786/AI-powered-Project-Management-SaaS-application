from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.activity_repository import ActivityRepository
from app.models.activity import Activity
from app.services.event_service import EventService
import uuid
from typing import Sequence, Tuple, Any

class ActivityService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ActivityRepository(db)

    async def get_project_activity(
        self, project_id: uuid.UUID, page: int = 1, limit: int = 20, filter_type: str = None
    ) -> Tuple[Sequence[Activity], int]:
        return await self.repo.get_by_project_paginated(project_id, page, limit, filter_type)

    async def log_activity(
        self, 
        project_id: uuid.UUID, 
        actor_id: uuid.UUID, 
        type: str, 
        description: str, 
        metadata_data: dict[str, Any] = None,
        task_id: uuid.UUID = None,
        org_id: uuid.UUID = None
    ) -> Activity:
        activity = Activity(
            type=type,
            description=description,
            metadata_data=metadata_data,
            project_id=project_id,
            task_id=task_id,
            actor_id=actor_id
        )
        
        created = await self.repo.create(activity)
        
        # Optionally broadcast the new activity to connected clients
        if org_id:
            await EventService.broadcast_project_update(org_id, project_id, {
                "activity_id": str(created.id),
                "type": type,
                "description": description
            })
            
        return created
