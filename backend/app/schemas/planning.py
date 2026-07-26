from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class GeneratePlanningRequest(BaseModel):
    requirement_id: uuid.UUID = Field(..., description="The ID of the approved SRS to base the plan on")
    additional_context: Optional[str] = Field(None, description="Any specific focus, constraints, or instructions for the AI planner")

class PlanningUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(Draft|Review|Approved|Archived)$")
    planning_content: Optional[str] = None

class PlanningResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: uuid.UUID
    requirement_id: uuid.UUID
    generated_by_id: uuid.UUID
    updated_by_id: Optional[uuid.UUID]
    version: int
    status: str
    planning_content: str
    estimated_duration: Optional[str] = None
    estimated_story_points: Optional[int] = 0
    estimated_hours: Optional[float] = 0.0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
