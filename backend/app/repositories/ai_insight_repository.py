from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.ai_insight import AIInsight
import uuid
from typing import Sequence

class AIInsightRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_by_project(self, org_id: uuid.UUID, project_id: uuid.UUID) -> Sequence[AIInsight]:
        query = select(AIInsight).where(
            AIInsight.project_id == project_id, 
            AIInsight.organization_id == org_id,
            AIInsight.status == "Active",
            AIInsight.is_deleted == False
        ).order_by(desc(AIInsight.priority), desc(AIInsight.created_at))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, insight_id: uuid.UUID, org_id: uuid.UUID) -> AIInsight | None:
        result = await self.db.execute(select(AIInsight).where(
            AIInsight.id == insight_id, 
            AIInsight.organization_id == org_id,
            AIInsight.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, insight: AIInsight) -> AIInsight:
        self.db.add(insight)
        await self.db.commit()
        await self.db.refresh(insight)
        return insight
        
    async def update(self, insight: AIInsight) -> AIInsight:
        await self.db.commit()
        await self.db.refresh(insight)
        return insight
