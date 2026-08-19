from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func
from fastapi import HTTPException
import uuid
import structlog

from app.models.task import Task
from app.models.user_organization import UserOrganization
from app.models.user import User
from app.schemas.task import AssignmentRecommendationResponse
from app.services.groq_service import GroqService
from app.utils.json_utils import extract_json
from pydantic import BaseModel
from typing import List, Optional

logger = structlog.get_logger()

class DevInfo(BaseModel):
    id: str
    name: str
    job_role: Optional[str]
    skills: List[str]
    current_workload_hours: float

class AssignmentRecommendationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_team_workloads(self, org_id: uuid.UUID) -> List[DevInfo]:
        # 1. Fetch all members in the organization who have accepted the invite
        stmt = select(UserOrganization, User).join(User, UserOrganization.user_id == User.id).where(
            UserOrganization.organization_id == org_id,
            UserOrganization.status == "accepted"
        )
        result = await self.db.execute(stmt)
        members = result.all()

        dev_infos = []
        for org_member, user in members:
            # 2. Calculate workload for this user (only tasks that are Todo, In Progress, Review)
            workload_stmt = select(func.sum(Task.estimated_hours)).where(
                Task.organization_id == org_id,
                Task.assignee_id == user.id,
                Task.status.in_(["Todo", "In Progress", "Review"])
            )
            workload_result = await self.db.execute(workload_stmt)
            total_hours = workload_result.scalar() or 0.0

            # Safe cast skills
            skills = org_member.skills if isinstance(org_member.skills, list) else []

            dev_infos.append(
                DevInfo(
                    id=str(user.id),
                    name=user.full_name or user.email,
                    job_role=org_member.job_role,
                    skills=skills,
                    current_workload_hours=total_hours
                )
            )

        return dev_infos

    async def recommend_developer(self, org_id: uuid.UUID, task: Task) -> AssignmentRecommendationResponse:
        # Get team workloads
        team = await self.get_team_workloads(org_id)
        
        if not team:
            raise HTTPException(status_code=400, detail="No eligible team members found in the organization.")

        # Prepare team data for AI prompt
        team_text = ""
        for dev in team:
            team_text += f"- ID: {dev.id}\n  Name: {dev.name}\n  Job Role: {dev.job_role}\n  Skills: {', '.join(dev.skills)}\n  Current Workload: {dev.current_workload_hours} hours\n\n"

        task_desc = task.description or ""
        # Build prompt
        prompt = f"""
You are an expert technical project manager allocating tasks to a development team.
Recommend the most suitable team member for the following task based on their job role, skills, and current workload.

### Task Details
Title: {task.title}
Description: {task_desc}
Phase: {task.phase}
Estimated Hours: {task.estimated_hours}
Requirements Addressed: {task.requirement_ids}

### Team Members
{team_text}

Analyze the task requirements and match them against the available team members' job roles and skills.
Favor members whose skills align well with the task context and who have a lower current workload.

Respond ONLY with a valid JSON object matching this schema exactly:
{{
    "recommended_developer_id": "<uuid from the Team Members list>",
    "developer_name": "<name of the recommended developer>",
    "job_role": "<their job role>",
    "matching_skills": ["<skill1>", "<skill2>"],
    "current_workload": <their current workload as float>,
    "estimated_task_hours": <the task estimated hours as float>,
    "confidence": <float between 0 and 100>,
    "reason": "<A brief, logical explanation of why this developer was chosen over others>"
}}
"""
        system_prompt = "You are an AI that exclusively outputs valid JSON. No markdown, no conversation."
        
        max_retries = 2
        for attempt in range(max_retries):
            try:
                result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
                logger.info("Groq Recommendation Request Completed", tokens_used=result["tokens"])
                
                parsed_json = extract_json(result["text"])
                
                # Check if recommended id is valid
                rec_id = parsed_json.get("recommended_developer_id")
                matched_dev = next((d for d in team if d.id == rec_id), None)
                if not matched_dev:
                    raise ValueError(f"AI recommended an invalid developer ID: {rec_id}")

                return AssignmentRecommendationResponse(
                    task_id=task.id,
                    recommended_developer_id=uuid.UUID(rec_id),
                    developer_name=parsed_json.get("developer_name", matched_dev.name),
                    job_role=parsed_json.get("job_role", matched_dev.job_role),
                    matching_skills=parsed_json.get("matching_skills", []),
                    current_workload=matched_dev.current_workload_hours,
                    estimated_task_hours=task.estimated_hours or 0.0,
                    confidence=float(parsed_json.get("confidence", 0)),
                    reason=parsed_json.get("reason", "")
                )
            except Exception as e:
                logger.error(f"Task Assignment Recommendation Failed on attempt {attempt+1}", error=str(e))
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=500, detail=f"AI returned invalid format or failed validation: {str(e)}")
