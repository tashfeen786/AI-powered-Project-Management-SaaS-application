from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response

router = APIRouter()

@router.post("/register", response_model=StandardResponse[UserResponse])
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.register_user(user_in)
    return success_response(data=UserResponse.model_validate(user), message="User registered successfully")

@router.post("/login", response_model=StandardResponse[Token])
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    token = await auth_service.authenticate_user(credentials)
    return success_response(data=token, message="Login successful")

@router.get("/me", response_model=StandardResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_active_user)):
    return success_response(data=UserResponse.model_validate(current_user), message="Current user retrieved")
