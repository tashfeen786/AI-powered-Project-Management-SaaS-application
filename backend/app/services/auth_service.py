from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.auth import UserCreate, UserLogin, Token
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.models.organization import Organization
from app.core.security import verify_password, get_password_hash, create_access_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        
    async def authenticate_user(self, credentials: UserLogin) -> Token:
        user = await self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        access_token = create_access_token(subject=user.id)
        return Token(access_token=access_token, token_type="bearer")
        
    async def register_user(self, user_in: UserCreate) -> User:
        user = await self.user_repo.get_by_email(user_in.email)
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Create organization first
        org = Organization(
            name=user_in.organization_name,
            domain=user_in.email.split('@')[1] if '@' in user_in.email else None
        )
        self.db.add(org)
        await self.db.flush()
        
        # Create user
        new_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name,
            role="admin",
            organization_id=org.id
        )
        
        return await self.user_repo.create(new_user)
