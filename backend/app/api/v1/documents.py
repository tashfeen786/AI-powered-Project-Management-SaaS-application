from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from app.db.session import get_db
from app.schemas.document import DocumentResponse, DocumentUpdate
from app.services.document_service import DocumentService
from app.services.rbac_service import RBACService, Permission
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response, paginated_response
from app.repositories.organization_repository import OrganizationRepository
from fastapi import HTTPException

router = APIRouter()

async def verify_org_and_role(current_user: User, db: AsyncSession, permission: Permission):
    if not current_user.current_organization_id:
        raise HTTPException(status_code=400, detail="No active organization context")
        
    org_repo = OrganizationRepository(db)
    role = await org_repo.get_user_role(current_user.id, current_user.current_organization_id)
    
    if not role or role.status != "accepted":
        raise HTTPException(status_code=403, detail="User is not an active member")
        
    if not RBACService.has_permission(role.role, permission):
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission.value}")
        
    return current_user.current_organization_id

@router.get("/projects/{project_id}/documents", response_model=StandardResponse)
async def list_project_documents(
    project_id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    doc_service = DocumentService(db)
    
    items, total = await doc_service.list_documents(org_id, project_id, page, limit, search)
    
    return paginated_response(
        items=[DocumentResponse.model_validate(doc).model_dump() for doc in items],
        total=total,
        page=page,
        limit=limit,
        message="Documents retrieved"
    )

@router.post("/projects/{project_id}/documents", response_model=StandardResponse[DocumentResponse])
async def upload_document(
    project_id: uuid.UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.MANAGE_DOCUMENTS)
    doc_service = DocumentService(db)
    
    doc = await doc_service.upload_document(current_user.id, org_id, project_id, file)
    return success_response(data=DocumentResponse.model_validate(doc), message="Document uploaded and processing started")

@router.get("/documents/{id}", response_model=StandardResponse[DocumentResponse])
async def get_document(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    doc_service = DocumentService(db)
    
    doc = await doc_service.get_document(org_id, id)
    return success_response(data=DocumentResponse.model_validate(doc), message="Document retrieved")

@router.patch("/documents/{id}", response_model=StandardResponse[DocumentResponse])
async def rename_document(
    id: uuid.UUID,
    update_in: DocumentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.MANAGE_DOCUMENTS)
    doc_service = DocumentService(db)
    
    if update_in.filename:
        doc = await doc_service.rename_document(org_id, id, update_in.filename)
    else:
        doc = await doc_service.get_document(org_id, id)
        
    return success_response(data=DocumentResponse.model_validate(doc), message="Document updated")

@router.delete("/documents/{id}", response_model=StandardResponse)
async def delete_document(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.MANAGE_DOCUMENTS)
    doc_service = DocumentService(db)
    
    await doc_service.delete_document(org_id, id)
    return success_response(message="Document deleted")
