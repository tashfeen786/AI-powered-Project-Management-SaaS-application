from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class CreateConversationRequest(BaseModel):
    project_id: Optional[uuid.UUID] = None
    title: Optional[str] = "New Conversation"

class ChatRequest(BaseModel):
    conversation_id: uuid.UUID
    content: str = Field(..., min_length=1)

class SourceItem(BaseModel):
    type: str # Document, Task, AI Insight, Planning, etc.
    title: str
    id: Optional[str] = None

class MessageResponse(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    sources: List[SourceItem] = []
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: Optional[uuid.UUID]
    created_by_id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = []
