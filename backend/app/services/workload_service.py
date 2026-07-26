from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.task import Task
from app.models.user import User
from app.schemas.ai_insight import WorkloadMemberStats, WorkloadResponse
import uuid
from typing import List

class WorkloadService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def calculate_project_workload(self, org_id: uuid.UUID, project_id: uuid.UUID) -> WorkloadResponse:
        """
        Calculates team workload distribution across a project.
        Determines Overloaded, Underloaded, and Balanced states based on heuristics.
        """
        # Fetch all tasks for project
        query = select(Task).where(
            Task.project_id == project_id,
            Task.organization_id == org_id,
            Task.is_deleted == False,
            Task.assignee_id.isnot(None)
        )
        result = await self.db.execute(query)
        tasks = result.scalars().all()
        
        # Aggregate by assignee
        stats_map = {}
        for t in tasks:
            uid = t.assignee_id
            if uid not in stats_map:
                stats_map[uid] = {
                    "tasks_count": 0,
                    "story_points": 0,
                    "estimated_hours": 0.0,
                    "completed_tasks": 0,
                    "open_tasks": 0
                }
                
            stats_map[uid]["tasks_count"] += 1
            stats_map[uid]["story_points"] += (t.story_points or 0)
            stats_map[uid]["estimated_hours"] += (t.estimated_hours or 0.0)
            
            if t.status == "Done":
                stats_map[uid]["completed_tasks"] += 1
            else:
                stats_map[uid]["open_tasks"] += 1
                
        # Resolve user details and calculate status
        team_stats = []
        for uid, data in stats_map.items():
            # In a real app we'd joinedload User, but doing simple query here
            user_result = await self.db.execute(select(User).where(User.id == uid))
            user = user_result.scalar_one_or_none()
            
            # Simple heuristic for workload
            status = "Balanced"
            if data["open_tasks"] > 10 or data["estimated_hours"] > 40:
                status = "Overloaded"
            elif data["open_tasks"] < 2 and data["estimated_hours"] < 10:
                status = "Underloaded"
                
            team_stats.append(WorkloadMemberStats(
                user_id=uid,
                full_name=user.full_name if user else None,
                email=user.email if user else None,
                tasks_count=data["tasks_count"],
                story_points=data["story_points"],
                estimated_hours=data["estimated_hours"],
                completed_tasks=data["completed_tasks"],
                open_tasks=data["open_tasks"],
                status=status
            ))
            
        recommendations = []
        overloaded = [ts for ts in team_stats if ts.status == "Overloaded"]
        underloaded = [ts for ts in team_stats if ts.status == "Underloaded"]
        
        if overloaded and underloaded:
            recommendations.append("Consider redistributing tasks from overloaded members to underloaded members to balance sprint velocity.")
        if not team_stats:
            recommendations.append("No tasks are currently assigned to team members.")
            
        return WorkloadResponse(
            project_id=project_id,
            total_tasks=len(tasks),
            team_stats=team_stats,
            recommendations=recommendations
        )
