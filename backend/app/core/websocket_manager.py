from fastapi import WebSocket
from typing import Dict, Set, List
import uuid
import structlog
from app.schemas.websocket import WsServerMessage
from datetime import datetime, UTC

logger = structlog.get_logger()

class ConnectionMeta:
    def __init__(self, websocket: WebSocket, user_id: uuid.UUID, org_id: uuid.UUID):
        self.websocket = websocket
        self.user_id = user_id
        self.org_id = org_id
        self.active_projects: Set[uuid.UUID] = set()

class WebSocketManager:
    """
    Centralized WebSocket manager.
    Currently in-memory.
    TODO: Integrate Redis Pub/Sub for horizontal scaling across multiple ASGI workers.
    """
    def __init__(self):
        # connection_id -> ConnectionMeta
        self.active_connections: Dict[str, ConnectionMeta] = {}
        # org_id -> Set[connection_id]
        self.org_rooms: Dict[uuid.UUID, Set[str]] = {}
        # project_id -> Set[connection_id]
        self.project_rooms: Dict[uuid.UUID, Set[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: uuid.UUID, org_id: uuid.UUID) -> str:
        await websocket.accept()
        connection_id = str(uuid.uuid4())
        
        meta = ConnectionMeta(websocket, user_id, org_id)
        self.active_connections[connection_id] = meta
        
        if org_id not in self.org_rooms:
            self.org_rooms[org_id] = set()
        self.org_rooms[org_id].add(connection_id)
        
        logger.info("WebSocket Connected", connection_id=connection_id, user_id=str(user_id))
        return connection_id

    def disconnect(self, connection_id: str):
        meta = self.active_connections.pop(connection_id, None)
        if meta:
            # Remove from Org room
            if meta.org_id in self.org_rooms:
                self.org_rooms[meta.org_id].discard(connection_id)
            
            # Remove from Project rooms
            for proj_id in meta.active_projects:
                if proj_id in self.project_rooms:
                    self.project_rooms[proj_id].discard(connection_id)
                    
            logger.info("WebSocket Disconnected", connection_id=connection_id, user_id=str(meta.user_id))

    def subscribe_to_project(self, connection_id: str, project_id: uuid.UUID):
        meta = self.active_connections.get(connection_id)
        if meta:
            meta.active_projects.add(project_id)
            if project_id not in self.project_rooms:
                self.project_rooms[project_id] = set()
            self.project_rooms[project_id].add(connection_id)

    def unsubscribe_from_project(self, connection_id: str, project_id: uuid.UUID):
        meta = self.active_connections.get(connection_id)
        if meta:
            meta.active_projects.discard(project_id)
            if project_id in self.project_rooms:
                self.project_rooms[project_id].discard(connection_id)

    async def send_personal_message(self, message: WsServerMessage, user_id: uuid.UUID):
        """Send message to all active connections belonging to a specific user"""
        for meta in self.active_connections.values():
            if meta.user_id == user_id:
                try:
                    await meta.websocket.send_json(message.model_dump(mode="json"))
                except Exception as e:
                    logger.error("Failed to send WS message", error=str(e))

    async def broadcast_to_organization(self, org_id: uuid.UUID, message: WsServerMessage):
        """Broadcast to all connections in an organization"""
        if org_id in self.org_rooms:
            dead_connections = []
            for conn_id in self.org_rooms[org_id]:
                meta = self.active_connections.get(conn_id)
                if meta:
                    try:
                        await meta.websocket.send_json(message.model_dump(mode="json"))
                    except Exception as e:
                        logger.error("Failed to broadcast WS to org", error=str(e))
                        dead_connections.append(conn_id)
            
            # Cleanup
            for conn_id in dead_connections:
                self.disconnect(conn_id)

    async def broadcast_to_project(self, project_id: uuid.UUID, message: WsServerMessage):
        """Broadcast to all connections actively viewing a project"""
        if project_id in self.project_rooms:
            dead_connections = []
            for conn_id in self.project_rooms[project_id]:
                meta = self.active_connections.get(conn_id)
                if meta:
                    try:
                        await meta.websocket.send_json(message.model_dump(mode="json"))
                    except Exception as e:
                        logger.error("Failed to broadcast WS to project", error=str(e))
                        dead_connections.append(conn_id)
                        
            for conn_id in dead_connections:
                self.disconnect(conn_id)

# Singleton Instance
manager = WebSocketManager()
