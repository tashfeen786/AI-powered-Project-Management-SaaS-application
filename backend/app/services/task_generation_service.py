from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.task_generation import GenerateTasksRequest, TaskGenerationPayload
from app.repositories.task_generation_repository import TaskGenerationRepository
from app.repositories.planning_repository import PlanningRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.services.task_generation_prompt_service import TaskGenerationPromptService
from app.services.groq_service import GroqService
from app.models.task_generation import TaskGeneration
from app.models.sprint import Sprint
from app.models.task import Task
from typing import Sequence
from datetime import datetime, UTC
import uuid
import structlog
import json
import time

logger = structlog.get_logger()

class TaskGenerationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.gen_repo = TaskGenerationRepository(db)
        self.plan_repo = PlanningRepository(db)
        self.project_repo = ProjectRepository(db)
        self.task_repo = TaskRepository(db)
        
    async def generate_tasks(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID, request: GenerateTasksRequest) -> TaskGeneration:
        logger.info("Task Generation Started", project_id=str(project_id), planning_id=str(request.planning_id))
        
        # 1. Validate Project & Planning
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        plan = await self.plan_repo.get_by_id(request.planning_id, org_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Planning document not found")
            
        if plan.status != "Approved":
            raise HTTPException(status_code=400, detail="Tasks can only be generated from an Approved Sprint Plan")
            
        # 2. Build Prompt
        prompt = TaskGenerationPromptService.build_task_generation_prompt(plan.planning_content)
        system_prompt = "You are an AI that exclusively outputs valid JSON. No markdown, no conversation."

        # 3. Call Groq with Retry
        max_retries = 2
        for attempt in range(max_retries):
            try:
                # DeepSeek or Llama 3.3 configured for JSON output
                result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
                logger.info("Groq Request Completed", tokens_used=result["tokens"])
                
                raw_text = result["text"].strip()
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].strip()
                
                parsed_json = json.loads(raw_text)
                # Validate against schema
                validated_payload = TaskGenerationPayload(**parsed_json)
                break
            except (json.JSONDecodeError, Exception) as e:
                logger.error(f"Task Generation Failed on attempt {attempt+1}", error=str(e))
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=500, detail="AI returned invalid JSON format or failed generation")

        # 5. Persistence (Pending Approval)
        generation = TaskGeneration(
            status="Pending",
            generated_tasks=validated_payload.model_dump(),
            planning_id=plan.id,
            project_id=project_id,
            organization_id=org_id,
            created_by_id=user_id
        )
        
        created = await self.gen_repo.create(generation)
        # TODO: Trigger Tasks Generated Hook
        return created

    async def get_generation(self, org_id: uuid.UUID, gen_id: uuid.UUID) -> TaskGeneration:
        gen = await self.gen_repo.get_by_id(gen_id, org_id)
        if not gen:
            raise HTTPException(status_code=404, detail="Task Generation record not found")
        return gen

    async def get_generations_for_project(self, org_id: uuid.UUID, project_id: uuid.UUID) -> Sequence[TaskGeneration]:
        return await self.gen_repo.get_by_project(org_id, project_id)

    async def approve_generation(self, user_id: uuid.UUID, org_id: uuid.UUID, gen_id: uuid.UUID) -> TaskGeneration:
        """
        Takes a pending TaskGeneration and officially materializes it into the database
        as real Sprints and Tasks for Kanban integration.
        """
        gen = await self.get_generation(org_id, gen_id)
        
        if gen.status != "Pending":
            raise HTTPException(status_code=400, detail="Only Pending task generations can be approved")
            
        payload = gen.generated_tasks
        
        # We need to map sprints to actual database rows, and tasks to actual task rows
        current_time = time.time()
        
        for sprint_data in payload.get("sprints", []):
            # Create Sprint
            sprint = Sprint(
                name=sprint_data.get("name", "Generated Sprint"),
                project_id=gen.project_id,
                organization_id=org_id
            )
            self.db.add(sprint)
            await self.db.flush() # get ID
            
            # Create Tasks
            for idx, task_data in enumerate(sprint_data.get("tasks", [])):
                desc = task_data.get("description", "")
                ac = task_data.get("acceptance_criteria", "")
                
                full_desc = desc
                if ac:
                    full_desc += f"\n\n**Acceptance Criteria:**\n{ac}"
                    
                deps = task_data.get("dependencies", [])
                if deps:
                    full_desc += f"\n\n**Dependencies:**\n" + "\n".join([f"- {d}" for d in deps])
                    
                task = Task(
                    title=task_data.get("title", "Untitled Task"),
                    description=full_desc,
                    priority=task_data.get("priority", "Medium"),
                    status="Todo",
                    story_points=task_data.get("story_points", 0),
                    estimated_hours=task_data.get("estimated_hours", 0.0),
                    labels=task_data.get("labels", []),
                    order_index=current_time + idx,
                    sprint_id=sprint.id,
                    project_id=gen.project_id,
                    organization_id=org_id,
                    reporter_id=user_id
                )
                self.db.add(task)
                
            # Flush tasks for this sprint
            await self.db.flush()
            
        gen.status = "Approved"
        await self.db.commit()
        
        logger.info("Generation Approved and Materialized", gen_id=str(gen.id))
        # TODO: Trigger Generation Approved Hook
        
        # Future Hooks:
        # TODO: AI Auto Assignment
        # TODO: AI Dependency Detection mapping
        # TODO: Risk Prediction
        
        return gen
