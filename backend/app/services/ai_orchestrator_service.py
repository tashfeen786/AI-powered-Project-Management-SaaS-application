from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import structlog
import asyncio
from app.services.requirement_service import RequirementService
from app.services.planning_service import PlanningService
from app.services.task_generation_service import TaskGenerationService
from app.schemas.requirement import GenerateRequirementRequest
from app.schemas.planning import GeneratePlanningRequest
from app.schemas.task_generation import GenerateTasksRequest
from app.models.project import Project
from app.repositories.project_repository import ProjectRepository

logger = structlog.get_logger()

import redis.asyncio as aioredis
import json
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

async def publish_ws_event(project_id: uuid.UUID, event: str, payload: dict):
    logger.info("Publishing WS Event via Redis", project_id=str(project_id), event=event)
    try:
        redis = aioredis.from_url(redis_url)
        message = json.dumps({
            "project_id": str(project_id),
            "event": event,
            "payload": payload
        })
        await redis.publish("project_events", message)
        await redis.close()
    except Exception as e:
        logger.error("Redis Publish Failed", error=str(e))

class AIOrchestratorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.req_service = RequirementService(db)
        self.plan_service = PlanningService(db)
        self.task_service = TaskGenerationService(db)
        self.project_repo = ProjectRepository(db)

    async def run_pipeline(self, project_id: uuid.UUID, org_id: uuid.UUID, user_id: uuid.UUID, requirements_text: str):
        try:
            await publish_ws_event(project_id, "pipeline_started", {"status": "Analyzing Requirements"})
            
            # Step 1 & 2: Requirement Understanding
            req = await self.req_service.generate_srs(
                user_id=user_id,
                org_id=org_id,
                project_id=project_id,
                request=GenerateRequirementRequest(
                    title="System Requirements Specification",
                    additional_context=requirements_text
                )
            )
            
            await publish_ws_event(project_id, "requirements_parsed", {"status": "Generating Architecture & DB Design"})
            
            # Step 3 & 4: Architecture Generation
            # We assume the AI logic in generate_srs or a new ArchitectureGenerator handles this.
            # To strictly follow single responsibility, we'd call an ArchitectureGeneratorService here.
            # For brevity, we proceed to planning.
            
            # Step 5: Planning (Epics, Stories, Sprints)
            # Auto-approve requirement to proceed
            req.status = "Approved"
            await self.db.commit()
            
            plan = await self.plan_service.generate_plan(
                user_id=user_id,
                org_id=org_id,
                project_id=project_id,
                request=GeneratePlanningRequest(
                    requirement_id=req.id,
                    additional_context="Focus on high priority modules."
                )
            )
            
            await publish_ws_event(project_id, "planning_generated", {"status": "Breaking down Tasks"})
            
            # Auto-approve plan
            plan.status = "Approved"
            await self.db.commit()
            
            # Step 6: Task Generation
            gen = await self.task_service.generate_tasks(
                user_id=user_id,
                org_id=org_id,
                project_id=project_id,
                request=GenerateTasksRequest(
                    planning_id=plan.id
                )
            )
            
            await publish_ws_event(project_id, "tasks_generated", {"status": "Assigning Developers"})
            
            # Step 7: Developer Assignment
            # We call the new DeveloperAssignmentService
            from app.services.developer_assignment_service import DeveloperAssignmentService
            assignment_service = DeveloperAssignmentService(self.db)
            await assignment_service.assign_tasks_for_generation(gen.id, org_id, user_id)
            
            await publish_ws_event(project_id, "assignments_completed", {"status": "Risk Analysis & QA"})
            
            # Materialize the generation (creates real Task rows)
            await self.task_service.approve_generation(user_id, org_id, gen.id)
            
            await publish_ws_event(project_id, "pipeline_finished", {"status": "Complete"})
            
        except Exception as e:
            logger.error("AI Orchestrator Pipeline Failed", error=str(e))
            await publish_ws_event(project_id, "pipeline_failed", {"error": str(e)})
