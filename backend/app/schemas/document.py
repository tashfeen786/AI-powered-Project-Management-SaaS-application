from pydantic import BaseModel
from typing import Optional
import uuid

class DocumentBase(BaseModel):
    title: str
    content: Optional[str] = None
    type: str

class DocumentCreate(DocumentBase):
    project_id: uuid.UUID

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    type: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: uuid.UUID
    project_id: uuid.UUID
    author_id: Optional[uuid.UUID]
    
    class Config:
        from_attributes = True
