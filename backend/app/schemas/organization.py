from pydantic import BaseModel
from typing import Optional
import uuid

class OrganizationBase(BaseModel):
    name: str
    domain: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None

class OrganizationResponse(OrganizationBase):
    id: uuid.UUID
    
    class Config:
        from_attributes = True

class SwitchOrganizationRequest(BaseModel):
    organization_id: uuid.UUID
