from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
import uuid

class ActivityResponse(BaseModel):
    id: uuid.UUID
    type: str
    description: str
    metadata_data: Optional[dict[str, Any]] = None
    project_id: Optional[uuid.UUID] = None
    task_id: Optional[uuid.UUID] = None
    actor_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
