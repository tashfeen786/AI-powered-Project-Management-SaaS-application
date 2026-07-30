from sqlalchemy import String, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import BaseModel
import uuid
from sqlalchemy.dialects.postgresql import JSONB

class Notification(BaseModel):
    __tablename__ = "notifications"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(50)) # e.g., info, warning, alert
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    
    metadata_data: Mapped[dict | None] = mapped_column(JSONB)
    
    user: Mapped["User"] = relationship()
