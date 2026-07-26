from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime
import uuid

# --- Client Sent Events ---
class WsClientMessage(BaseModel):
    event: str # join_project, leave_project, typing_start, typing_stop, ping
    project_id: Optional[uuid.UUID] = None
    payload: Dict[str, Any] = {}

# --- Server Sent Events ---
class WsServerMessage(BaseModel):
    event: str
    project_id: Optional[uuid.UUID] = None
    organization_id: Optional[uuid.UUID] = None
    timestamp: datetime
    payload: Dict[str, Any]
    
    class Config:
        json_encoders = {
            uuid.UUID: str,
            datetime: lambda v: v.isoformat()
        }
