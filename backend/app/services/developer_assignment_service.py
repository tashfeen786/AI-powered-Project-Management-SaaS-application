from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
import uuid
import structlog
import json
from app.services.team_service import TeamService
from app.services.groq_service import GroqService
from app.repositories.task_generation_repository import TaskGenerationRepository
from app.repositories.user_repository import UserRepository

logger = structlog.get_logger()

class DeveloperAssignmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.team_service = TeamService(db)
        self.gen_repo = TaskGenerationRepository(db)
        self.user_repo = UserRepository(db)

    async def assign_tasks_for_generation(self, gen_id: uuid.UUID, org_id: uuid.UUID, user_id: uuid.UUID):
        logger.info("Starting Developer Assignment", gen_id=str(gen_id))
        
        # 1. Fetch Task Generation payload
        gen = await self.gen_repo.get_by_id(gen_id, org_id)
        if not gen:
            raise HTTPException(status_code=404, detail="Generation not found")
            
        payload = gen.generated_tasks
        
        # 2. Fetch Available Developers (Team Members)
        members = await self.team_service.get_team(user_id, org_id)
        
        developer_profiles = []
        for m in members:
            # We fetch user details. In a real scenario, developers have skills, velocity, etc. saved in their profile.
            user = await self.user_repo.get_by_id(m.user_id)
            if user:
                developer_profiles.append({
                    "id": str(user.id),
                    "name": user.full_name or user.email,
                    "role": m.role,
                    # Simulating skills since they might not be on the model yet
                    "skills": ["React", "Python", "PostgreSQL", "DevOps", "Testing"],
                    "current_workload": "Low",
                })
                
        if not developer_profiles:
            logger.warning("No developers available in the organization to assign tasks.")
            # Prompt AI to recommend hiring profiles instead
            
        # 3. Build Prompt for Assignment
        prompt = f"""
You are an expert Engineering Manager. Assign the following tasks to the available developers based on their skills and role.
If no suitable developer exists for a task, assign it to null and provide a 'hiring_recommendation'.

Available Developers:
{json.dumps(developer_profiles, indent=2)}

Tasks to Assign:
{json.dumps(payload.get('sprints', []), indent=2)}

Output JSON ONLY in this exact format:
{{
  "assignments": [
    {{
      "task_title": "...",
      "assigned_developer_id": "uuid or null",
      "reason": "...",
      "hiring_recommendation": "If null, describe the role and skills needed."
    }}
  ]
}}
"""
        system_prompt = "You are a JSON-only API. No markdown, no conversation."
        
        # 4. Call Groq with Retry
        max_retries = 2
        assignments_data = {}
        for attempt in range(max_retries):
            try:
                result = await GroqService.generate(prompt=prompt, system_prompt=system_prompt)
                raw_text = result["text"].strip()
                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].strip()
                
                assignments_data = json.loads(raw_text)
                break
            except (json.JSONDecodeError, Exception) as e:
                logger.warning(f"Groq parsing failed on attempt {attempt+1}", error=str(e))
                if attempt == max_retries - 1:
                    logger.error("Developer Assignment Failed completely due to unparseable output")
                    return # Exit gracefully without crashing pipeline
        
        try:
            # 5. Apply assignments to the payload
            assignment_map = { a.get("task_title"): a for a in assignments_data.get("assignments", []) }
            
            for sprint in payload.get("sprints", []):
                for task in sprint.get("tasks", []):
                    title = task.get("title")
                    if title in assignment_map:
                        a = assignment_map[title]
                        if a.get("assigned_developer_id"):
                            task["assignee_id"] = a["assigned_developer_id"]
                        elif a.get("hiring_recommendation"):
                            task["hiring_recommendation"] = a["hiring_recommendation"]
                        
            # Save updated payload back
            gen.generated_tasks = payload
            await self.db.commit()
            
            logger.info("Developer Assignment Completed", assignments_count=len(assignment_map))
            
        except Exception as e:
            logger.error("Developer Assignment Failed", error=str(e))
            # Non-blocking, the pipeline can proceed even if auto-assignment fails
