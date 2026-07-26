from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class JobCreateRequest(BaseModel):
    job_type: str = Field(..., description="The internal key for the job type to execute")
    project_id: Optional[uuid.UUID] = None
    payload: Dict[str, Any] = {}

class JobResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: Optional[uuid.UUID]
    created_by_id: uuid.UUID
    job_type: str
    status: str
    progress: int
    result: Dict[str, Any]
    error: Optional[str]
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
