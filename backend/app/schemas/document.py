from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

class DocumentUpdate(BaseModel):
    filename: Optional[str] = None
    folder_path: Optional[str] = None

class DocumentResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: uuid.UUID
    uploaded_by_id: uuid.UUID
    filename: str
    original_filename: str
    extension: str
    mime_type: str
    file_size: int
    checksum: str
    processing_status: str
    folder_path: str = "root"
    version: int = 1
    parser_version: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
