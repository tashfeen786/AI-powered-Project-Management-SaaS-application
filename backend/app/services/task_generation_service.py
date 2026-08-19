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
            raise HTTPException(status_code=400, detail="No approved planning is available for task generation.")
            
        # Also need approved requirements
        from app.repositories.requirement_repository import RequirementRepository
        req_repo = RequirementRepository(self.db)
        reqs, _ = await req_repo.get_by_project_paginated(org_id, project_id, page=1, limit=500, status="Approved")
        if not reqs or len(reqs) == 0:
            raise HTTPException(status_code=400, detail="No approved requirements are available for task generation.")
            
        req_text = "\n\n---\n\n".join(
            [f"ID: {r.id}\nTitle: {r.title}\nCategory: {r.category}\nPriority: {r.priority}\nDescription: {r.description}\nAcceptance Criteria: {r.acceptance_criteria}" for r in reqs]
        )
        approved_req_ids = {str(r.id) for r in reqs}
            
        # Validate plan has 5 phases
        import json
        from app.utils.json_utils import extract_json
        
        try:
            plan_json = json.loads(plan.planning_content)
        except Exception:
            raise HTTPException(status_code=500, detail="Approved planning is malformed.")
            
        phases = plan_json.get("phases", [])
        if len(phases) != 5:
            raise HTTPException(status_code=500, detail="Approved planning must have exactly 5 phases.")
            
        valid_phase_names = {p.get("name") for p in phases}
            
        # 2. Build Prompt
        prompt = TaskGenerationPromptService.build_task_generation_prompt(req_text, plan.planning_content)
        system_prompt = "You are an AI that exclusively outputs valid JSON. No markdown, no conversation."

        # 3. Call Groq with Retry
        max_retries = 2
        for attempt in range(max_retries):
            try:
                result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
                logger.info("Groq Request Completed", tokens_used=result["tokens"])
                
                parsed_json = extract_json(result["text"])
                
                # Validate against schema
                validated_payload = TaskGenerationPayload(**parsed_json)
                
                # Validate requirement IDs and phases
                for task in validated_payload.tasks:
                    if task.phase not in valid_phase_names:
                        raise ValueError(f"Task phase '{task.phase}' not found in approved planning.")
                    if not task.requirement_ids:
                        raise ValueError(f"Task '{task.title}' has no requirement IDs linked.")
                    for req_id in task.requirement_ids:
                        if req_id not in approved_req_ids:
                            raise ValueError(f"Task '{task.title}' references invalid or unapproved requirement {req_id}.")
                break
            except Exception as e:
                logger.error(f"Task Generation Failed on attempt {attempt+1}", error=str(e))
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=500, detail=f"AI returned invalid format or failed validation: {str(e)}")

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

    async def update_generation(self, user_id: uuid.UUID, org_id: uuid.UUID, gen_id: uuid.UUID, payload: TaskGenerationPayload) -> TaskGeneration:
        gen = await self.get_generation(org_id, gen_id)
        if gen.status != "Pending":
            raise HTTPException(status_code=400, detail="Only Pending task generations can be updated")
        
        gen.generated_tasks = payload.model_dump()
        await self.db.commit()
        return gen

    async def approve_generation(self, user_id: uuid.UUID, org_id: uuid.UUID, gen_id: uuid.UUID) -> TaskGeneration:
        """
        Takes a pending TaskGeneration and officially materializes it into the database
        as real Sprints and Tasks for Kanban integration.
        """
        gen = await self.get_generation(org_id, gen_id)
        
        if gen.status != "Pending":
            raise HTTPException(status_code=400, detail="Only Pending task generations can be approved")
            
        payload = gen.generated_tasks
        
        # We need to map tasks to actual task rows
        current_time = time.time()
        
        # We don't create Sprints automatically here anymore since they are grouped by Phase now.
        # We just create Tasks and assign them to the Project.
        
        for idx, task_data in enumerate(payload.get("tasks", [])):
            desc = task_data.get("description", "")
            ac = task_data.get("acceptance_criteria", [])
            
            full_desc = desc
            if ac and len(ac) > 0:
                full_desc += f"\n\n**Acceptance Criteria:**\n" + "\n".join([f"- {a}" for a in ac])
                
            deps = task_data.get("dependencies", [])
            if deps and len(deps) > 0:
                full_desc += f"\n\n**Dependencies:**\n" + "\n".join([f"- {d}" for d in deps])
                
            task = Task(
                title=task_data.get("title", "Untitled Task"),
                description=full_desc,
                priority=task_data.get("priority", "Medium"),
                status="Todo",
                story_points=task_data.get("story_points", 0),
                estimated_hours=task_data.get("estimated_hours", 0.0),
                requirement_ids=task_data.get("requirement_ids", []),
                phase=task_data.get("phase", ""),
                order_index=current_time + idx,
                sprint_id=None,
                project_id=gen.project_id,
                organization_id=org_id,
                reporter_id=user_id
            )
            self.db.add(task)
            
        # Flush tasks
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
