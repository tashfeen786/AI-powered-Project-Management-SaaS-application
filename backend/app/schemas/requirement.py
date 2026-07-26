from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class GenerateRequirementRequest(BaseModel):
    title: str = Field(..., description="Title of the SRS document to generate")
    additional_context: Optional[str] = Field(None, description="Any specific focus or instructions for the AI")

class RequirementUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(Draft|Review|Approved|Archived)$")
    generated_content: Optional[str] = None

class RequirementResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: uuid.UUID
    generated_by_id: uuid.UUID
    updated_by_id: Optional[uuid.UUID]
    title: str
    version: int
    status: str
    confidence_score: float
    generated_content: str
    source_documents: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
