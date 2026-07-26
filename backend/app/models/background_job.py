from sqlalchemy import String, Integer, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import BaseModel
from datetime import datetime
import uuid

class BackgroundJob(BaseModel):
    __tablename__ = "background_jobs"

    job_type: Mapped[str] = mapped_column(String(100)) # e.g. document_parsing, sprint_planning, ai_insights
    status: Mapped[str] = mapped_column(String(50), default="Pending") # Pending, Queued, Running, Completed, Failed, Cancelled
    progress: Mapped[int] = mapped_column(Integer, default=0) # 0 to 100
    
    result: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    error: Mapped[str | None] = mapped_column(String(2000))
    
    started_at: Mapped[datetime | None] = mapped_column()
    completed_at: Mapped[datetime | None] = mapped_column()
    
    project_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("projects.id"))
    project: Mapped["Project"] = relationship()
    
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))
    
    created_by_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_by: Mapped["User"] = relationship(foreign_keys=[created_by_id])
