from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
from datetime import datetime
import uuid

class UserOrganization(BaseModel):
    __tablename__ = "organization_members"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    
    role: Mapped[str] = mapped_column(String(50), default="viewer") # owner, admin, pm, developer, designer, qa, viewer
    status: Mapped[str] = mapped_column(String(50), default="pending") # pending, accepted, inactive, suspended
    
    job_role: Mapped[str | None] = mapped_column(String(100))
    skills: Mapped[list | None] = mapped_column(JSONB)
    
    invited_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    joined_at: Mapped[datetime | None] = mapped_column(DateTime)
    
    user: Mapped["User"] = relationship(back_populates="user_organizations", foreign_keys=[user_id])
    organization: Mapped["Organization"] = relationship(back_populates="user_organizations")
    inviter: Mapped["User"] = relationship(foreign_keys=[invited_by])
