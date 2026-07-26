from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.ai_insight_repository import AIInsightRepository
from app.repositories.project_repository import ProjectRepository
from app.services.workload_service import WorkloadService
from app.services.ai_prompt_service import AIPromptService
from app.services.groq_service import GroqService
from app.services.notification_service import NotificationService
from app.models.ai_insight import AIInsight
from app.schemas.ai_insight import GeneratedInsightsPayload
from typing import Sequence
import uuid
import structlog
import json
from sqlalchemy import select
from app.models.task import Task
from app.models.sprint import Sprint

logger = structlog.get_logger()

class AIInsightService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.insight_repo = AIInsightRepository(db)
        self.project_repo = ProjectRepository(db)
        self.workload_service = WorkloadService(db)
        
    async def _gather_metrics(self, org_id: uuid.UUID, project_id: uuid.UUID):
        """Helper to collect broad project data for AI context."""
        # 1. Project Info
        project = await self.project_repo.get_by_id(project_id, org_id)
        project_data = {
            "name": project.name,
            "status": project.status,
            "priority": project.priority,
            "progress": project.progress,
            "end_date": str(project.end_date) if project.end_date else None
        }
        
        # 2. Task metrics
        result = await self.db.execute(select(Task).where(Task.project_id == project_id, Task.is_deleted == False))
        tasks = result.scalars().all()
        task_metrics = {
            "total": len(tasks),
            "todo": len([t for t in tasks if t.status == "To Do"]),
            "in_progress": len([t for t in tasks if t.status == "In Progress"]),
            "done": len([t for t in tasks if t.status == "Done"]),
            "high_priority": len([t for t in tasks if t.priority in ["High", "Critical"] and t.status != "Done"])
        }
        
        # 3. Workload
        workload = await self.workload_service.calculate_project_workload(org_id, project_id)
        workload_data = [t.model_dump() for t in workload.team_stats]
        
        return project_data, task_metrics, workload_data

    async def generate_project_insights(self, org_id: uuid.UUID, project_id: uuid.UUID) -> Sequence[AIInsight]:
        """
        Analyzes the complete project state and generates automated insights.
        """
        logger.info("Generating AI Insights", project_id=str(project_id))
        
        # 1. Gather comprehensive state
        project_data, task_metrics, workload_data = await self._gather_metrics(org_id, project_id)
        
        # 2. Build Prompt
        prompt = AIPromptService.build_insight_prompt(project_data, task_metrics, workload_data)
        system_prompt = "You are an AI that exclusively outputs valid JSON. No markdown, no conversation."
        
        # 3. Call Groq
        try:
            result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt, model="llama3-70b-8192")
        except Exception as e:
            logger.error("Insight Generation Failed", error=str(e))
            raise HTTPException(status_code=500, detail="AI insight generation failed")

        # 4. Parse & Validate JSON
        try:
            raw_text = result["text"].strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "").replace("```", "")
                
            parsed_json = json.loads(raw_text)
            payload = GeneratedInsightsPayload(**parsed_json)
        except Exception as e:
            logger.error("JSON Parsing Failed for Insights", error=str(e))
            raise HTTPException(status_code=500, detail="AI returned invalid JSON")
            
        # 5. Persist Insights & Trigger Notifications
        created_insights = []
        for item in payload.insights:
            insight = AIInsight(
                type=item.type,
                title=item.title,
                description=item.description,
                priority=item.priority,
                confidence_score=item.confidence,
                project_id=project_id,
                organization_id=org_id
            )
            created = await self.insight_repo.create(insight)
            created_insights.append(created)
            
            # Smart Routing for Notifications based on Priority & Type
            if item.priority == "Critical" and item.type == "Risk":
                await NotificationService.notify_project_risk(project_id, item.title, item.description)
            elif item.type == "Blocker":
                await NotificationService.notify_blocker(project_id, item.title, item.description)
            elif item.type == "Workload" and "overload" in item.description.lower():
                await NotificationService.notify_overload(project_id, item.title, item.description)
                
        # TODO: Trigger Automation Activity Log
        
        return created_insights

    async def get_project_insights(self, org_id: uuid.UUID, project_id: uuid.UUID) -> Sequence[AIInsight]:
        return await self.insight_repo.get_active_by_project(org_id, project_id)
        
    async def resolve_insight(self, org_id: uuid.UUID, insight_id: uuid.UUID, status: str) -> AIInsight:
        insight = await self.insight_repo.get_by_id(insight_id, org_id)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")
            
        insight.status = status
        await self.insight_repo.update(insight)
        
        # TODO: Trigger Insight Resolved Activity Log
        return insight
