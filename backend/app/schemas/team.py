from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid

class TeamMemberInvite(BaseModel):
    email: EmailStr
    role: str = Field(..., pattern="^(owner|admin|pm|developer|designer|qa|viewer)$")

class TeamMemberUpdate(BaseModel):
    role: Optional[str] = Field(None, pattern="^(owner|admin|pm|developer|designer|qa|viewer)$")
    status: Optional[str] = Field(None, pattern="^(pending|accepted|inactive|suspended)$")
    job_role: Optional[str] = None
    skills: Optional[List[str]] = None

class TeamMemberResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: uuid.UUID
    role: str
    status: str
    job_role: Optional[str] = None
    skills: Optional[List[str]] = None
    invited_by: Optional[uuid.UUID]
    joined_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    # We can include user details in the response for frontend convenience
    email: Optional[str] = None
    full_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class InviteAcceptRequest(BaseModel):
    # In a real app, this would be a secure token sent to email
    token: str
