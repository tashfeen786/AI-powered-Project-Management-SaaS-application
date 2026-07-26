from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid

class UserOrganization(BaseModel):
    __tablename__ = "user_organizations"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(50), default="member") # owner, admin, member
    
    user: Mapped["User"] = relationship(back_populates="user_organizations")
    organization: Mapped["Organization"] = relationship(back_populates="user_organizations")
