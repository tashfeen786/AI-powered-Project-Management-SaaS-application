from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class GenerateTasksRequest(BaseModel):
    planning_id: uuid.UUID = Field(..., description="The ID of the approved Sprint Plan to base tasks on")

# --- AI Output Validation Schemas ---
class GeneratedTaskItem(BaseModel):
    title: str
    description: str
    requirement_ids: List[str]
    phase: str
    priority: str = Field(pattern="^(Low|Medium|High|Critical)$")
    status: str = Field(pattern="^(Todo|In Progress|Review|Done)$", default="Todo")
    story_points: int
    estimated_hours: float
    acceptance_criteria: List[str] = []
    dependencies: List[str] = []

class TaskGenerationPayload(BaseModel):
    tasks: List[GeneratedTaskItem]
# ------------------------------------

class TaskGenerationResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: uuid.UUID
    planning_id: uuid.UUID
    created_by_id: uuid.UUID
    status: str
    generated_tasks: TaskGenerationPayload
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
