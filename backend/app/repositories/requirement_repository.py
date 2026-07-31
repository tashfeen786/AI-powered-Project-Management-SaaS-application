from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.requirement import Requirement
import uuid
from typing import Sequence, Tuple

class RequirementRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_paginated(
        self, 
        org_id: uuid.UUID,
        project_id: uuid.UUID,
        page: int = 1,
        limit: int = 10,
        status: str | None = None,
        priority: str | None = None,
        search: str | None = None,
        sort_by: str = "created_at",
        sort_desc: bool = True
    ) -> Tuple[Sequence[Requirement], int]:
        
        query = select(Requirement).where(
            Requirement.project_id == project_id, 
            Requirement.organization_id == org_id,
            Requirement.is_deleted == False
        )
        
        if status:
            query = query.where(Requirement.status == status)
        if priority:
            query = query.where(Requirement.priority == priority)
        if search:
            query = query.where(
                (Requirement.title.ilike(f"%{search}%")) |
                (Requirement.description.ilike(f"%{search}%")) |
                (Requirement.category.ilike(f"%{search}%"))
            )
            
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar_one()
        
        # Determine sort column
        sort_col = Requirement.created_at
        if sort_by == "title":
            sort_col = Requirement.title
        elif sort_by == "priority":
            sort_col = Requirement.priority
        elif sort_by == "status":
            sort_col = Requirement.status
            
        if sort_desc:
            query = query.order_by(desc(sort_col))
        else:
            query = query.order_by(sort_col)
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        items = (await self.db.execute(query)).scalars().all()
        return items, total

    async def get_latest_version(self, org_id: uuid.UUID, project_id: uuid.UUID) -> int:
        query = select(func.max(Requirement.version)).where(
            Requirement.project_id == project_id,
            Requirement.organization_id == org_id
        )
        result = await self.db.execute(query)
        latest = result.scalar_one_or_none()
        return latest if latest is not None else 0

    async def get_by_id(self, req_id: uuid.UUID, org_id: uuid.UUID) -> Requirement | None:
        result = await self.db.execute(select(Requirement).where(
            Requirement.id == req_id, 
            Requirement.organization_id == org_id,
            Requirement.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, requirement: Requirement) -> Requirement:
        self.db.add(requirement)
        await self.db.commit()
        await self.db.refresh(requirement)
        return requirement
        
    async def update(self, requirement: Requirement) -> Requirement:
        await self.db.commit()
        await self.db.refresh(requirement)
        return requirement
        
    async def delete(self, requirement: Requirement) -> None:
        requirement.is_deleted = True
        await self.db.commit()
