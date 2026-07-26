from pydantic import BaseModel
from typing import Optional
import uuid

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    story_points: Optional[int] = 0

class TaskCreate(TaskBase):
    project_id: uuid.UUID

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    assignee_id: Optional[uuid.UUID] = None

class TaskResponse(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    assignee_id: Optional[uuid.UUID]
    
    class Config:
        from_attributes = True
