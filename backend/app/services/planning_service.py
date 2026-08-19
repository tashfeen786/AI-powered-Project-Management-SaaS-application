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
        logger.info("Planning Started", project_id=str(project_id))
        
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        reqs, _ = await self.req_repo.get_by_project_paginated(org_id, project_id, page=1, limit=500, status="Approved")
        if not reqs or len(reqs) == 0:
            raise HTTPException(status_code=400, detail="No approved requirements are available for planning.")
            
        req_text = "\n\n---\n\n".join(
            [f"ID: {r.id}\nTitle: {r.title}\nCategory: {r.category}\nPriority: {r.priority}\nDescription: {r.description}\nAcceptance Criteria: {r.acceptance_criteria}" for r in reqs]
        )
        approved_req_ids = {str(r.id) for r in reqs}
            
        prompt = PlanningPromptService.build_sprint_plan_prompt(
            srs_content=req_text,
            additional_context=request.additional_context
        )
        system_prompt = "You are an expert Agile Scrum Master and Technical Project Manager. Output only valid JSON."

        try:
            result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
        except Exception as e:
            logger.error("Planning Failed", error=str(e))
            raise HTTPException(status_code=500, detail="AI planning generation failed")

        logger.info("Planning Completed", tokens_used=result["tokens"])

        from app.utils.json_utils import extract_json
        import json
        
        try:
            parsed_json = extract_json(result["text"])
        except ValueError as e:
            logger.error("Planning JSON parsing failed", error=str(e), text=result["text"])
            raise HTTPException(status_code=500, detail="Failed to parse AI planning response")
            
        phases = parsed_json.get("phases", [])
        if len(phases) != 5:
            raise HTTPException(status_code=500, detail=f"AI generated {len(phases)} phases instead of exactly 5.")
            
        total_hours = 0.0
        total_points = 0
        
        for i, phase in enumerate(phases):
            if "name" not in phase or "description" not in phase or "objective" not in phase:
                raise HTTPException(status_code=500, detail="Missing required phase fields in AI response.")
            total_hours += float(phase.get("estimated_hours", 0))
            total_points += int(phase.get("story_points", 0))
            
            # Validate requirements
            req_ids = phase.get("requirement_ids", [])
            valid_req_ids = [rid for rid in req_ids if str(rid) in approved_req_ids]
            phase["requirement_ids"] = valid_req_ids
            
        content = json.dumps(parsed_json)
        duration = "5 Phases"

        latest_version = await self.plan_repo.get_latest_version(org_id, project_id)
        new_version = latest_version + 1

        plan = Planning(
            version=new_version,
            status="Draft",
            planning_content=content,
            estimated_duration=duration,
            estimated_story_points=total_points,
            estimated_hours=total_hours,
            requirement_id=None,
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
        # Parsing planning_content markdown to extract Tasks, Sprints, and Milestones 
        # is handled asynchronously via the Planning Processor Microservice.
        pass
    # endregion
