from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
import uuid

class SprintCreate(BaseModel):
    project_id: uuid.UUID
    name: str
    goal: Optional[str] = None
    status: Optional[str] = "Draft"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration: Optional[int] = None
    capacity: Optional[int] = None
    team_members: Optional[List[str]] = []
    velocity: Optional[int] = None
    story_points: Optional[int] = None
    ai_generated_plan: Optional[str] = None
    timeline_suggestion: Optional[str] = None
    risks_suggestion: Optional[str] = None

class SprintUpdate(BaseModel):
    name: Optional[str] = None
    goal: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration: Optional[int] = None
    capacity: Optional[int] = None
    team_members: Optional[List[str]] = None
    velocity: Optional[int] = None
    story_points: Optional[int] = None
    ai_generated_plan: Optional[str] = None
    timeline_suggestion: Optional[str] = None
    risks_suggestion: Optional[str] = None

class SprintResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    goal: Optional[str]
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    duration: Optional[int]
    capacity: Optional[int]
    team_members: Optional[List[str]]
    velocity: Optional[int]
    story_points: Optional[int]
    ai_generated_plan: Optional[str]
    timeline_suggestion: Optional[str]
    risks_suggestion: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GenerateSprintPlanRequest(BaseModel):
    project_id: uuid.UUID
    sprint_goal: str
    duration: int
    team_members: List[str]
    velocity: int
