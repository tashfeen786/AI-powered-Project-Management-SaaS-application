from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# --- AI Output Schemas ---
class GeneratedInsightItem(BaseModel):
    type: str = Field(pattern="^(Risk|Recommendation|Deadline|Blocker|Dependency|Workload|Quality|Sprint|Requirement|Document)$")
    title: str
    description: str
    priority: str = Field(pattern="^(Low|Medium|High|Critical)$")
    confidence: float

class GeneratedInsightsPayload(BaseModel):
    insights: List[GeneratedInsightItem]

# --- API Response Schemas ---
class AIInsightResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    project_id: uuid.UUID
    type: str
    title: str
    description: str
    priority: str
    status: str
    confidence_score: float
    metadata_: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class InsightResolveRequest(BaseModel):
    status: str = Field(pattern="^(Resolved|Dismissed)$")

class WorkloadMemberStats(BaseModel):
    user_id: uuid.UUID
    full_name: Optional[str]
    email: Optional[str]
    tasks_count: int
    story_points: int
    estimated_hours: float
    completed_tasks: int
    open_tasks: int
    status: str = "Balanced" # Underloaded, Balanced, Overloaded

class WorkloadResponse(BaseModel):
    project_id: uuid.UUID
    total_tasks: int
    team_stats: List[WorkloadMemberStats]
    recommendations: List[str]
