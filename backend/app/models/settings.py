from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid
from sqlalchemy.dialects.postgresql import JSONB

class Setting(BaseModel):
    __tablename__ = "settings"

    organization_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    
    key: Mapped[str] = mapped_column(String(255), index=True)
    value: Mapped[dict | None] = mapped_column(JSONB)
    
    organization: Mapped["Organization"] = relationship()
    user: Mapped["User"] = relationship()
