from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class GenerateRequirementRequest(BaseModel):
    title: str = Field(..., description="Title of the SRS document to generate")
    additional_context: Optional[str] = Field(None, description="Any specific focus or instructions for the AI")

class RequirementCreate(BaseModel):
    project_id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Draft"
    acceptance_criteria: Optional[str] = None
    generated_content: Optional[str] = None

class RequirementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(Draft|Review|Approved|Archived)$")
    acceptance_criteria: Optional[str] = None
    generated_content: Optional[str] = None

class RequirementResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: uuid.UUID
    created_by_id: uuid.UUID
    updated_by_id: Optional[uuid.UUID]
    title: str
    description: Optional[str]
    category: Optional[str]
    priority: Optional[str]
    status: str
    acceptance_criteria: Optional[str]
    version: int
    confidence_score: float
    generated_content: Optional[str]
    source_documents: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
