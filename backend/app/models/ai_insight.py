from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
import uuid

class AIInsight(BaseModel):
    __tablename__ = "ai_insights"

    type: Mapped[str] = mapped_column(String(50)) # Risk, Recommendation, Deadline, Blocker, Dependency, Workload, etc.
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(1000))
    priority: Mapped[str] = mapped_column(String(50)) # Low, Medium, High, Critical
    status: Mapped[str] = mapped_column(String(50), default="Active") # Active, Resolved, Dismissed
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    
    metadata_: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship()
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
