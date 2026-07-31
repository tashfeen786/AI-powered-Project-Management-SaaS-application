from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.sprint import Sprint
import uuid
from typing import Sequence, Tuple

class SprintRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_paginated(
        self, 
        org_id: uuid.UUID,
        project_id: uuid.UUID,
        page: int = 1,
        limit: int = 10,
        status: str | None = None
    ) -> Tuple[Sequence[Sprint], int]:
        
        query = select(Sprint).where(
            Sprint.project_id == project_id, 
            Sprint.organization_id == org_id,
            Sprint.is_deleted == False
        )
        
        if status:
            query = query.where(Sprint.status == status)
            
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar_one()
        
        query = query.order_by(desc(Sprint.created_at))
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        items = (await self.db.execute(query)).scalars().all()
        return items, total

    async def get_current_sprint(self, org_id: uuid.UUID, project_id: uuid.UUID) -> Sprint | None:
        query = select(Sprint).where(
            Sprint.project_id == project_id,
            Sprint.organization_id == org_id,
            Sprint.status == "Active",
            Sprint.is_deleted == False
        ).order_by(desc(Sprint.created_at)).limit(1)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id(self, sprint_id: uuid.UUID, org_id: uuid.UUID) -> Sprint | None:
        result = await self.db.execute(select(Sprint).where(
            Sprint.id == sprint_id, 
            Sprint.organization_id == org_id,
            Sprint.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, sprint: Sprint) -> Sprint:
        self.db.add(sprint)
        await self.db.commit()
        await self.db.refresh(sprint)
        return sprint
        
    async def update(self, sprint: Sprint) -> Sprint:
        await self.db.commit()
        await self.db.refresh(sprint)
        return sprint
        
    async def delete(self, sprint: Sprint) -> None:
        sprint.is_deleted = True
        await self.db.commit()
