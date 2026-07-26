from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.planning import Planning
import uuid
from typing import Sequence, Tuple

class PlanningRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_paginated(
        self, 
        org_id: uuid.UUID,
        project_id: uuid.UUID,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[Sequence[Planning], int]:
        
        query = select(Planning).where(
            Planning.project_id == project_id, 
            Planning.organization_id == org_id,
            Planning.is_deleted == False
        )
        
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar_one()
        
        query = query.order_by(desc(Planning.version), desc(Planning.created_at))
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        items = (await self.db.execute(query)).scalars().all()
        return items, total

    async def get_latest_version(self, org_id: uuid.UUID, project_id: uuid.UUID) -> int:
        query = select(func.max(Planning.version)).where(
            Planning.project_id == project_id,
            Planning.organization_id == org_id
        )
        result = await self.db.execute(query)
        latest = result.scalar_one_or_none()
        return latest if latest is not None else 0

    async def get_by_id(self, plan_id: uuid.UUID, org_id: uuid.UUID) -> Planning | None:
        result = await self.db.execute(select(Planning).where(
            Planning.id == plan_id, 
            Planning.organization_id == org_id,
            Planning.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, planning: Planning) -> Planning:
        self.db.add(planning)
        await self.db.commit()
        await self.db.refresh(planning)
        return planning
        
    async def update(self, planning: Planning) -> Planning:
        await self.db.commit()
        await self.db.refresh(planning)
        return planning
        
    async def delete(self, planning: Planning) -> None:
        planning.is_deleted = True
        await self.db.commit()
