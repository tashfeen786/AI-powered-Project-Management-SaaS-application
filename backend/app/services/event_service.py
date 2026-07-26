import uuid
from datetime import datetime, UTC
from app.core.websocket_manager import manager
from app.schemas.websocket import WsServerMessage
import structlog

logger = structlog.get_logger()

class EventService:
    """
    Helper service to construct and dispatch real-time events.
    """
    @staticmethod
    async def broadcast_task_event(event_type: str, org_id: uuid.UUID, project_id: uuid.UUID, task_id: uuid.UUID, payload: dict):
        """
        event_type: task_created, task_updated, task_deleted, task_moved
        """
        msg = WsServerMessage(
            event=event_type,
            project_id=project_id,
            organization_id=org_id,
            timestamp=datetime.now(UTC),
            payload={
                "task_id": str(task_id),
                **payload
            }
        )
        await manager.broadcast_to_project(project_id, msg)
        logger.info("Broadcasted Task Event", event=event_type, task_id=str(task_id))

    @staticmethod
    async def broadcast_ai_event(event_type: str, org_id: uuid.UUID, project_id: uuid.UUID, payload: dict):
        """
        event_type: requirement_generated, planning_generated, insight_generated, copilot_message
        """
        msg = WsServerMessage(
            event=event_type,
            project_id=project_id,
            organization_id=org_id,
            timestamp=datetime.now(UTC),
            payload=payload
        )
        await manager.broadcast_to_project(project_id, msg)
        logger.info("Broadcasted AI Event", event=event_type, project_id=str(project_id))

    @staticmethod
    async def broadcast_project_update(org_id: uuid.UUID, project_id: uuid.UUID, payload: dict):
        msg = WsServerMessage(
            event="project_updated",
            project_id=project_id,
            organization_id=org_id,
            timestamp=datetime.now(UTC),
            payload=payload
        )
        # Notify both the project room and the wider org room (e.g. for dashboard updates)
        await manager.broadcast_to_project(project_id, msg)
        await manager.broadcast_to_organization(org_id, msg)
        
    @staticmethod
    async def broadcast_document_event(org_id: uuid.UUID, project_id: uuid.UUID, doc_id: uuid.UUID, status: str):
        msg = WsServerMessage(
            event="document_processed",
            project_id=project_id,
            organization_id=org_id,
            timestamp=datetime.now(UTC),
            payload={"document_id": str(doc_id), "status": status}
        )
        await manager.broadcast_to_project(project_id, msg)
