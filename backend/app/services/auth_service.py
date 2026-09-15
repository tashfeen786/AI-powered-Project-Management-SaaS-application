from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from datetime import timedelta
from app.schemas.auth import UserCreate, UserLogin, Token, TokenPayload
from app.repositories.user_repository import UserRepository
from app.repositories.organization_repository import OrganizationRepository
from app.models.user import User
from app.models.organization import Organization
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from jose import jwt, JWTError

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.org_repo = OrganizationRepository(db)
        
    async def authenticate_user(self, credentials: UserLogin) -> Token:
        user = await self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        access_token = create_access_token(subject=user.id)
        refresh_token = create_access_token(
            subject=user.id, 
            expires_delta=timedelta(days=30)
        )
        
        return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")
        
    async def register_user(self, user_in: UserCreate) -> User:
        user = await self.user_repo.get_by_email(user_in.email)
        if user:
            raise HTTPException(status_code=409, detail="Email already registered")
            
        # Check if organization domain exists, otherwise create it
        domain = user_in.email.split('@')[1] if '@' in user_in.email else None
        
        created_org = None
        if domain:
            created_org = await self.org_repo.get_by_domain(domain)
            
        if not created_org:
            org = Organization(
                name=user_in.organization_name,
                domain=domain
            )
            created_org = await self.org_repo.create(org)
        
        # Create user
        new_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            current_organization_id=created_org.id
        )
        
        created_user = await self.user_repo.create(new_user)
        
        # Add user to organization as owner
        await self.org_repo.add_user_to_org(created_user.id, created_org.id, role="owner")
        
        return created_user

    async def refresh_token(self, refresh_token: str) -> Token:
        credentials_exception = HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
            token_data = TokenPayload(**payload)
            if token_data.sub is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
            
        user = await self.user_repo.get_by_id(token_data.sub)
        if not user or not user.is_active:
            raise credentials_exception
            
        access_token = create_access_token(subject=user.id)
        new_refresh_token = create_access_token(
            subject=user.id, 
            expires_delta=timedelta(days=30)
        )
        
        return Token(access_token=access_token, refresh_token=new_refresh_token, token_type="bearer")
