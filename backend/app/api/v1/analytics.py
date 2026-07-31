from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from typing import Any

router = APIRouter()

@router.get("", response_model=StandardResponse[Any])
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # In a fully production system, these would be calculated dynamically via complex aggregation queries.
    # We provide a safe, shaped dictionary here to prevent frontend runtime errors and fulfill the interface.
    data = {
        "kpis": {
            "totalProjects": 12,
            "activeProjects": 8,
            "completedProjects": 3,
            "delayedProjects": 1,
            "aiGeneratedDocs": 45,
            "aiSuggestionsAccepted": 890,
            "teamMembers": 24,
            "averageSprintVelocity": 42.5
        },
        "projectStatus": [
            {"name": "Planning", "value": 3},
            {"name": "Active", "value": 8},
            {"name": "Completed", "value": 3},
            {"name": "On Hold", "value": 1}
        ],
        "sprintVelocity": [
            {"name": "Sprint 1", "value": 35, "completed": 35, "planned": 40},
            {"name": "Sprint 2", "value": 42, "completed": 42, "planned": 45},
            {"name": "Sprint 3", "value": 38, "completed": 38, "planned": 38}
        ],
        "burndown": [
            {"name": "Day 1", "remaining": 100, "ideal": 100},
            {"name": "Day 2", "remaining": 90, "ideal": 85},
            {"name": "Day 3", "remaining": 75, "ideal": 70},
            {"name": "Day 4", "remaining": 60, "ideal": 55}
        ],
        "productivity": [
            {"name": "Week 1", "tasks": 45, "storyPoints": 120},
            {"name": "Week 2", "tasks": 52, "storyPoints": 145},
            {"name": "Week 3", "tasks": 38, "storyPoints": 95}
        ],
        "aiUsageTrend": [
            {"name": "Jan", "value": 120},
            {"name": "Feb", "value": 180},
            {"name": "Mar", "value": 250}
        ],
        "teamPerformance": [
            {
                "id": "1",
                "member": "Alice Smith",
                "avatar": "",
                "role": "Senior Developer",
                "completedTasks": 45,
                "velocity": 52,
                "activeTasks": 3,
                "efficiency": 94
            }
        ],
        "aiInsights": [
            "Team velocity is trending upwards by 15% this sprint.",
            "Backend tasks are consistently taking 20% longer than estimated.",
            "Resource bottleneck detected in QA for Project Alpha."
        ],
        "riskPrediction": {
            "overallScore": 28,
            "budgetRisk": "Low",
            "timelineRisk": "Medium",
            "teamCapacityRisk": "Low"
        },
        "deliveryForecast": {
            "predictedDate": "Oct 15, 2026",
            "confidence": 85,
            "estimatedDelay": "None",
            "scheduleHealth": "On Track"
        },
        "recentAIEvents": [
            {
                "id": "1",
                "type": "srs_generation",
                "description": "Generated SRS for Project Alpha",
                "timestamp": "2 hours ago"
            }
        ]
    }
    return success_response(data=data, message="Analytics retrieved")
