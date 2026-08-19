from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime
import uuid

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = "Todo"
    priority: str = "Medium"
    story_points: Optional[int] = 0
    estimated_hours: Optional[float] = 0.0
    actual_hours: Optional[float] = 0.0
    due_date: Optional[date] = None
    labels: Optional[List[str]] = None
    requirement_ids: Optional[List[str]] = None
    phase: Optional[str] = None
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
    requirement_ids: Optional[List[str]] = None
    phase: Optional[str] = None
    sprint_id: Optional[uuid.UUID] = None

class TaskMove(BaseModel):
    status: str
    order_index: float

class TaskAssign(BaseModel):
    assignee_id: Optional[uuid.UUID] = None

class AssignmentRecommendationResponse(BaseModel):
    task_id: uuid.UUID
    recommended_developer_id: uuid.UUID
    developer_name: str
    job_role: Optional[str]
    matching_skills: List[str]
    current_workload: float
    estimated_task_hours: float
    confidence: float
    reason: str

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1)

class TaskCommentResponse(BaseModel):
    id: uuid.UUID
    content: str
    author_id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskAttachmentResponse(BaseModel):
    id: uuid.UUID
    filename: str
    file_url: str
    file_size: int
    content_type: str
    uploaded_by_id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskActivityResponse(BaseModel):
    id: uuid.UUID
    type: str
    description: str
    metadata_data: Optional[Dict[str, Any]] = None
    actor_id: Optional[uuid.UUID] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class TaskAssigneeResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    
    class Config:
        from_attributes = True

class TaskResponse(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    organization_id: uuid.UUID
    assignee_id: Optional[uuid.UUID]
    assignee: Optional[TaskAssigneeResponse] = None
    reporter_id: Optional[uuid.UUID]
    order_index: float
    comments: List[TaskCommentResponse] = []
    attachments: List[TaskAttachmentResponse] = []
    activities: List[TaskActivityResponse] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
