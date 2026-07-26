from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime
import uuid

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = "To Do"
    priority: str = "Medium"
    story_points: Optional[int] = 0
    estimated_hours: Optional[float] = 0.0
    actual_hours: Optional[float] = 0.0
    due_date: Optional[date] = None
    labels: Optional[List[str]] = None
    sprint_id: Optional[uuid.UUID] = None

class TaskCreate(TaskBase):
    project_id: uuid.UUID
    assignee_id: Optional[uuid.UUID] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    story_points: Optional[int] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    due_date: Optional[date] = None
    labels: Optional[List[str]] = None
    sprint_id: Optional[uuid.UUID] = None

class TaskMove(BaseModel):
    status: str
    order_index: float

class TaskAssign(BaseModel):
    assignee_id: Optional[uuid.UUID] = None

class TaskResponse(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    organization_id: uuid.UUID
    assignee_id: Optional[uuid.UUID]
    reporter_id: Optional[uuid.UUID]
    order_index: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
