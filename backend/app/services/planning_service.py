from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.planning import GeneratePlanningRequest, PlanningUpdate
from app.repositories.planning_repository import PlanningRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.requirement_repository import RequirementRepository
from app.services.planning_prompt_service import PlanningPromptService
from app.services.groq_service import GroqService
from app.models.planning import Planning
from typing import Sequence, Tuple
import uuid
import structlog
import re

logger = structlog.get_logger()

class PlanningService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.plan_repo = PlanningRepository(db)
        self.project_repo = ProjectRepository(db)
        self.req_repo = RequirementRepository(db)
        
    def _parse_metadata(self, text: str) -> Tuple[str, str, int, float]:
        """
        Extracts ESTIMATED_DURATION, ESTIMATED_STORY_POINTS, ESTIMATED_HOURS 
        from the top of the AI response and strips them from the markdown content.
        """
        duration = None
        story_points = 0
        hours = 0.0
        
        lines = text.split("\n")
        content_lines = []
        
        for line in lines:
            if line.startswith("ESTIMATED_DURATION:"):
                duration = line.split(":", 1)[1].strip()
            elif line.startswith("ESTIMATED_STORY_POINTS:"):
                try:
                    # extract digits
                    sp_str = "".join(filter(str.isdigit, line))
                    story_points = int(sp_str) if sp_str else 0
                except:
                    pass
            elif line.startswith("ESTIMATED_HOURS:"):
                try:
                    # extract float
                    match = re.search(r"[\d\.]+", line)
                    if match:
                        hours = float(match.group())
                except:
                    pass
            else:
                content_lines.append(line)
                
        return "\n".join(content_lines).strip(), duration, story_points, hours

    async def generate_plan(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID, request: GeneratePlanningRequest) -> Planning:
        """
        Transforms an Approved SRS into a Sprint Plan.
        """
        logger.info("Planning Started", project_id=str(project_id), requirement_id=str(request.requirement_id))
        
        # 1. Validate Project & Requirement
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        req = await self.req_repo.get_by_id(request.requirement_id, org_id)
        if not req:
            raise HTTPException(status_code=404, detail="Requirement not found")
            
        if req.status != "Approved":
            # Forcing approved SRS to maintain agile rigor, though this could be configurable
            logger.warning("Using non-approved SRS for planning", status=req.status)
            
        # 2. Build Prompt
        prompt = PlanningPromptService.build_sprint_plan_prompt(
            srs_content=req.generated_content,
            additional_context=request.additional_context
        )
        system_prompt = "You are an expert Technical Project Manager and Scrum Master."

        # 3. Call Groq
        try:
            # Using llama3-70b-8192 for logical structuring and planning
            result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt, model="llama3-70b-8192")
        except Exception as e:
            logger.error("Planning Failed", error=str(e))
            raise HTTPException(status_code=500, detail="AI planning generation failed")

        logger.info("Planning Completed", tokens_used=result["tokens"])

        # 4. Parse Metadata
        content, duration, points, hours = self._parse_metadata(result["text"])

        # 5. Versioning & Persistence
        latest_version = await self.plan_repo.get_latest_version(org_id, project_id)
        new_version = latest_version + 1

        plan = Planning(
            version=new_version,
            status="Draft",
            planning_content=content,
            estimated_duration=duration,
            estimated_story_points=points,
            estimated_hours=hours,
            requirement_id=req.id,
            project_id=project_id,
            organization_id=org_id,
            generated_by_id=user_id
        )
        
        created = await self.plan_repo.create(plan)
        return created

    async def get_plannings(self, org_id: uuid.UUID, project_id: uuid.UUID, page: int = 1, limit: int = 10) -> Tuple[Sequence[Planning], int]:
        return await self.plan_repo.get_by_project_paginated(org_id, project_id, page, limit)

    async def get_planning(self, org_id: uuid.UUID, plan_id: uuid.UUID) -> Planning:
        plan = await self.plan_repo.get_by_id(plan_id, org_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Planning document not found")
        return plan

    async def update_planning(self, user_id: uuid.UUID, org_id: uuid.UUID, plan_id: uuid.UUID, update_in: PlanningUpdate) -> Planning:
        plan = await self.get_planning(org_id, plan_id)
        
        if update_in.status is not None:
            plan.status = update_in.status
        if update_in.planning_content is not None:
            plan.planning_content = update_in.planning_content
            
        plan.updated_by_id = user_id
        
        return await self.plan_repo.update(plan)

    async def approve_planning(self, user_id: uuid.UUID, org_id: uuid.UUID, plan_id: uuid.UUID) -> Planning:
        """
        Approves the plan. Ready for task generation workflow hook.
        """
        plan = await self.get_planning(org_id, plan_id)
        plan.status = "Approved"
        plan.updated_by_id = user_id
        
        updated = await self.plan_repo.update(plan)
        logger.info("Planning Approved", plan_id=str(plan.id))
        
        # Workflow Hook preparation: 
        # self.generate_milestones(plan.id)
        # self.generate_sprints(plan.id)
        # self.generate_tasks(plan.id)
        
        return updated

    async def delete_planning(self, org_id: uuid.UUID, plan_id: uuid.UUID) -> None:
        plan = await self.get_planning(org_id, plan_id)
        await self.plan_repo.delete(plan)

    # region Hooks for Future Features
    def generate_tasks(self, plan_id: uuid.UUID):
        # TODO: Parse planning_content markdown to extract Tasks and insert via TaskService
        pass
        
    def generate_sprints(self, plan_id: uuid.UUID):
        # TODO: Parse planning_content markdown to extract Sprints and insert to DB
        pass
        
    def generate_milestones(self, plan_id: uuid.UUID):
        # TODO: Parse planning_content markdown to extract Milestones and insert to DB
        pass
    # endregion
