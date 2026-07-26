from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
from typing import List
import uuid

class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str | None] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Track the current active organization for the user session
    current_organization_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("organizations.id", use_alter=True))
    
    # The organizations this user belongs to
    user_organizations: Mapped[List["UserOrganization"]] = relationship(back_populates="user", cascade="all, delete-orphan")
