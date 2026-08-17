import asyncio
import uuid
import structlog
from app.core.celery_app import celery_app
from app.db.session import AsyncSessionLocal

logger = structlog.get_logger()

@celery_app.task(name="app.tasks.orchestrator_tasks.run_ai_orchestrator")
def run_ai_orchestrator(project_id: str, org_id: str, user_id: str, requirements: str):
    logger.info("Starting AI Orchestrator Pipeline", project_id=project_id)
    
    async def _run_pipeline():
        # Late import to avoid circular dependencies
        from app.services.ai_orchestrator_service import AIOrchestratorService
        async with AsyncSessionLocal() as db:
            orchestrator = AIOrchestratorService(db)
            await orchestrator.run_pipeline(
                project_id=uuid.UUID(project_id),
                org_id=uuid.UUID(org_id),
                user_id=uuid.UUID(user_id),
                requirements_text=requirements
            )
            
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(_run_pipeline())
        return {"status": "enqueued in running loop", "project_id": project_id}
    except RuntimeError:
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        loop.run_until_complete(_run_pipeline())
        return {"status": "completed", "project_id": project_id}
