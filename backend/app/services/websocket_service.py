from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.core.websocket_manager import manager
from app.services.presence_service import presence_service
from app.schemas.websocket import WsClientMessage
from app.core.security import verify_token
from app.repositories.user_repository import UserRepository
import structlog
import json
from pydantic import ValidationError

logger = structlog.get_logger()

class WebSocketService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def authenticate_connection(self, token: str) -> tuple[uuid.UUID, uuid.UUID]:
        """Validates JWT and returns (user_id, org_id)"""
        payload = verify_token(token)
        if not payload:
            raise ValueError("Invalid or expired token")
            
        user_id = uuid.UUID(payload["sub"])
        user = await self.user_repo.get_by_id(user_id)
        
        if not user or not user.current_organization_id:
            raise ValueError("User not found or no active organization")
            
        return user.id, user.current_organization_id

    async def handle_connection(self, websocket: WebSocket, token: str):
        try:
            user_id, org_id = await self.authenticate_connection(token)
        except Exception as e:
            logger.warning("WebSocket Auth Failed", error=str(e))
            await websocket.close(code=1008) # Policy Violation
            return
            
        connection_id = await manager.connect(websocket, user_id, org_id)
        presence_service.user_connected(user_id)
        
        try:
            while True:
                data = await websocket.receive_text()
                try:
                    payload = json.loads(data)
                    msg = WsClientMessage(**payload)
                    await self._process_client_message(connection_id, user_id, org_id, msg)
                except (json.JSONDecodeError, ValidationError) as e:
                    logger.error("Invalid WS message format", error=str(e))
                    
        except WebSocketDisconnect:
            manager.disconnect(connection_id)
            presence_service.user_disconnected(user_id)

    async def _process_client_message(self, connection_id: str, user_id: uuid.UUID, org_id: uuid.UUID, msg: WsClientMessage):
        if msg.event == "join_project":
            if msg.project_id:
                manager.subscribe_to_project(connection_id, msg.project_id)
                logger.debug("User joined project room", user=str(user_id), project=str(msg.project_id))
                
        elif msg.event == "leave_project":
            if msg.project_id:
                manager.unsubscribe_from_project(connection_id, msg.project_id)
                logger.debug("User left project room", user=str(user_id), project=str(msg.project_id))
                
        elif msg.event == "typing_start":
            if msg.project_id:
                await presence_service.broadcast_typing_status(user_id, org_id, msg.project_id, True)
                
        elif msg.event == "typing_stop":
            if msg.project_id:
                await presence_service.broadcast_typing_status(user_id, org_id, msg.project_id, False)
                
        elif msg.event == "ping":
            meta = manager.active_connections.get(connection_id)
            if meta:
                await meta.websocket.send_json({"event": "pong"})
