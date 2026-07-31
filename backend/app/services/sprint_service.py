from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.sprint import SprintCreate, SprintUpdate, GenerateSprintPlanRequest
from app.repositories.sprint_repository import SprintRepository
from app.repositories.project_repository import ProjectRepository
from app.services.groq_service import GroqService
from app.models.sprint import Sprint
from typing import Sequence, Tuple
import uuid
import structlog
import json
from app.services.activity_service import ActivityService

logger = structlog.get_logger()

class SprintService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.sprint_repo = SprintRepository(db)
        self.project_repo = ProjectRepository(db)
        
    async def get_sprints(self, org_id: uuid.UUID, project_id: uuid.UUID, page: int = 1, limit: int = 10, status: str | None = None) -> Tuple[Sequence[Sprint], int]:
        return await self.sprint_repo.get_by_project_paginated(org_id, project_id, page, limit, status)

    async def get_sprint(self, org_id: uuid.UUID, sprint_id: uuid.UUID) -> Sprint:
        sprint = await self.sprint_repo.get_by_id(sprint_id, org_id)
        if not sprint:
            raise HTTPException(status_code=404, detail="Sprint not found")
        return sprint

    async def create_sprint(self, org_id: uuid.UUID, create_in: SprintCreate) -> Sprint:
        sprint = Sprint(
            name=create_in.name,
            goal=create_in.goal,
            status=create_in.status,
            start_date=create_in.start_date,
            end_date=create_in.end_date,
            duration=create_in.duration,
            capacity=create_in.capacity,
            team_members=create_in.team_members,
            velocity=create_in.velocity,
            story_points=create_in.story_points,
            ai_generated_plan=create_in.ai_generated_plan,
            timeline_suggestion=create_in.timeline_suggestion,
            risks_suggestion=create_in.risks_suggestion,
            project_id=create_in.project_id,
            organization_id=org_id
        )
        created = await self.sprint_repo.create(sprint)
        
        # User actor might not be passed directly here (need to check the route), but we will assume it's system if None
        act_service = ActivityService(self.db)
        await act_service.log_activity(
            project_id=create_in.project_id,
            actor_id=None, # In a real scenario we'd pass user_id down
            type="sprint_created",
            description=f"Created sprint '{create_in.name}'",
            org_id=org_id
        )
        
        return created

    async def update_sprint(self, org_id: uuid.UUID, sprint_id: uuid.UUID, update_in: SprintUpdate) -> Sprint:
        sprint = await self.get_sprint(org_id, sprint_id)
        
        update_data = update_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(sprint, field, value)
            
        return await self.sprint_repo.update(sprint)

    async def delete_sprint(self, org_id: uuid.UUID, sprint_id: uuid.UUID) -> None:
        sprint = await self.get_sprint(org_id, sprint_id)
        await self.sprint_repo.delete(sprint)
        
    async def generate_sprint_plan(self, org_id: uuid.UUID, request: GenerateSprintPlanRequest) -> dict:
        """
        Calls Groq to generate a sprint plan including tasks, timeline, and risks.
        """
        project = await self.project_repo.get_by_id(request.project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        prompt = f"""
        You are an expert Agile Scrum Master. 
        Create a sprint plan for a software project based on these constraints:
        
        Project Name: {project.name}
        Sprint Goal: {request.sprint_goal}
        Duration: {request.duration} weeks
        Team Velocity: {request.velocity} story points
        Team Members: {", ".join(request.team_members)}
        
        Output a structured JSON response EXACTLY matching this format:
        {{
            "ai_generated_plan": "A summary of the sprint plan and objectives.",
            "timeline_suggestion": "A high-level timeline breakdown per week.",
            "risks_suggestion": "Potential risks and mitigation strategies.",
            "suggested_story_points": 45,
            "tasks": [
                {{"title": "Task 1", "description": "...", "story_points": 5, "priority": "High"}}
            ]
        }}
        
        Do not include any other text outside the JSON. Ensure valid JSON.
        """
        
        try:
            result = await GroqService.generate(
                prompt=prompt, 
                system_prompt="You are a helpful Agile planner that responds ONLY in valid JSON format.", 
                model="llama3-70b-8192"
            )
            content = result["text"].strip()
            
            # Clean up markdown formatting if present
            if content.startswith("```json"):
                content = content.replace("```json", "", 1)
            if content.endswith("```"):
                content = content.replace("```", "")
                
            parsed = json.loads(content.strip())
            return parsed
        except json.JSONDecodeError as e:
            logger.error("JSON Decode Error in Sprint Generation", error=str(e), content=result["text"])
            raise HTTPException(status_code=500, detail="AI generated invalid JSON")
        except Exception as e:
            logger.error("Generation Failed", error=str(e))
            raise HTTPException(status_code=500, detail="AI generation failed")
