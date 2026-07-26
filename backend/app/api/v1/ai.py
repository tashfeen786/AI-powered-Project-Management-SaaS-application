from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.ai import AIQueryRequest, AIResponse
from app.services.ai_service import AIService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
import uuid

router = APIRouter()

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

@router.post("/query", response_model=StandardResponse[AIResponse])
async def ai_query(
    request: AIQueryRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    """
    General semantic search and question answering endpoint using RAG.
    """
    ai_service = AIService(db)
    response = await ai_service.generate_response(current_user.id, org_id, request)
    return success_response(data=response, message="AI response generated successfully")
