from pydantic import BaseModel
from typing import Optional
from datetime import date
import uuid

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "planning"
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    key: str
    organization_id: uuid.UUID
    
    class Config:
        from_attributes = True
