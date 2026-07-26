from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.ai_insight import AIInsight
from app.models.task import Task
from app.models.project import Project
from app.models.requirement import Requirement
import uuid
import structlog

logger = structlog.get_logger()

class ContextService:
    """
    Service responsible for pulling non-vector metadata into the Copilot context.
    (Vector RAG is handled separately by RetrievalService).
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def gather_project_context(self, project_id: uuid.UUID, org_id: uuid.UUID) -> dict:
        """
        Pulls a massive, unified state of the project.
        """
        # 1. Project Info
        project = await self.db.execute(select(Project).where(Project.id == project_id))
        proj = project.scalar_one_or_none()
        if not proj:
            return {}

        # 2. Latest AI Insights
        insights = await self.db.execute(
            select(AIInsight).where(
                AIInsight.project_id == project_id, 
                AIInsight.status == "Active"
            ).order_by(desc(AIInsight.created_at)).limit(5)
        )
        active_insights = [{"type": i.type, "title": i.title, "priority": i.priority} for i in insights.scalars().all()]
        
        # 3. Active Tasks Summary
        tasks = await self.db.execute(
            select(Task).where(
                Task.project_id == project_id,
                Task.status != "Done"
            ).limit(20)
        )
        active_tasks = [{"title": t.title, "status": t.status, "priority": t.priority} for t in tasks.scalars().all()]
        
        # 4. Latest SRS Status
        reqs = await self.db.execute(
            select(Requirement).where(Requirement.project_id == project_id).order_by(desc(Requirement.version)).limit(1)
        )
        latest_req = reqs.scalar_one_or_none()
        req_status = latest_req.status if latest_req else "None"
        
        return {
            "project_name": proj.name,
            "project_status": proj.status,
            "active_insights": active_insights,
            "open_tasks_summary": active_tasks,
            "requirements_status": req_status
        }
