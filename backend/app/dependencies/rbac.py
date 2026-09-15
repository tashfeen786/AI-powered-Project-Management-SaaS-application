from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.organization_repository import OrganizationRepository
from app.services.rbac_service import RBACService, Permission
from app.dependencies.auth import get_current_active_user
from app.db.session import get_db
import uuid

async def verify_org_and_role(current_user: User, db: AsyncSession, permission: Permission) -> uuid.UUID:
    if not current_user.current_organization_id:
        raise HTTPException(status_code=400, detail="No active organization context")
        
    org_repo = OrganizationRepository(db)
    role = await org_repo.get_user_role(current_user.id, current_user.current_organization_id)
    
    if not role or role.status != "accepted":
        raise HTTPException(status_code=403, detail="User is not an active member")
        
    if not RBACService.has_permission(role.role, permission):
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission.value}")
        
    return current_user.current_organization_id

def require_permission(permission: Permission):
    async def _dependency(
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
    ) -> uuid.UUID:
        return await verify_org_and_role(current_user, db, permission)
    return _dependency
