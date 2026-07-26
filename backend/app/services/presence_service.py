import uuid
import structlog
from datetime import datetime, UTC
from typing import Dict
from app.core.websocket_manager import manager
from app.schemas.websocket import WsServerMessage

logger = structlog.get_logger()

class PresenceService:
    """
    Tracks which users are online and who is typing.
    In-memory dicts. For distributed setup, these should move to Redis.
    """
    def __init__(self):
        # user_id -> { "last_seen": timestamp, "projects": [project_id] }
        self.online_users: Dict[uuid.UUID, dict] = {}
        
    def user_connected(self, user_id: uuid.UUID):
        if user_id not in self.online_users:
            self.online_users[user_id] = {"projects": set()}
        self.online_users[user_id]["last_seen"] = datetime.now(UTC)
        
    def user_disconnected(self, user_id: uuid.UUID):
        # If user has no active WS connections left, mark offline
        # For simplicity, we just keep them but update last_seen
        if user_id in self.online_users:
            self.online_users[user_id]["last_seen"] = datetime.now(UTC)

    async def broadcast_typing_status(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID, is_typing: bool):
        msg = WsServerMessage(
            event="typing_status",
            project_id=project_id,
            organization_id=org_id,
            timestamp=datetime.now(UTC),
            payload={
                "user_id": str(user_id),
                "is_typing": is_typing
            }
        )
        await manager.broadcast_to_project(project_id, msg)

# Singleton
presence_service = PresenceService()
