from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.activity import Activity
import uuid
from typing import Sequence, Tuple

class ActivityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_paginated(
        self, project_id: uuid.UUID, page: int, limit: int, filter_type: str = None
    ) -> Tuple[Sequence[Activity], int]:
        query = select(Activity).where(Activity.project_id == project_id)
        
        if filter_type:
            query = query.where(Activity.type == filter_type)
            
        # Count total
        from sqlalchemy import func
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar_one()
        
        # Paginate
        query = query.order_by(desc(Activity.created_at)).offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(query)
        activities = result.scalars().all()
        return activities, total

    async def create(self, activity: Activity) -> Activity:
        self.db.add(activity)
        await self.db.commit()
        await self.db.refresh(activity)
        return activity
