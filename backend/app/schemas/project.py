from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
import uuid

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = "Planning"
    priority: str = "Medium"
    progress: int = Field(0, ge=0, le=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    key: str
    organization_id: uuid.UUID
    created_by_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProjectStatistics(BaseModel):
    total: int
    planning: int
    active: int
    completed: int
    on_hold: int

class QuickAction(BaseModel):
    id: str
    title: str
    action: str
    project_id: Optional[uuid.UUID] = None
