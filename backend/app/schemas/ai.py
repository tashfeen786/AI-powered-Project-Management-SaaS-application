from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid

class AIQueryRequest(BaseModel):
    query: str = Field(..., min_length=1)
    project_id: uuid.UUID
    context_limit: int = 5
    
    # Optional parameters for future extensions
    conversation_id: Optional[uuid.UUID] = None
    stream: bool = False

class AIResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]] = []
    model: str
    tokens_used: Optional[int] = 0

class TextChunk(BaseModel):
    chunk_index: int
    text: str
    metadata: Dict[str, Any] = {}
