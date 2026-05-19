from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from core.database import get_db
from core.exceptions import InvalidCredentialsError, InvalidTokenError, UserNotFoundError
from repositories.user_repository import UserRepository
from services.auth_service import AuthService
from schemas import LoginRequest, TokenResponse, UserResponse

router = APIRouter()
security = HTTPBearer()


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """DI: собираем цепочку зависимостей."""
    return AuthService(UserRepository(db))


@router.post("/auth/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    try:
        token = auth_service.authenticate(payload.username, payload.password)
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    return TokenResponse(access_token=token)


@router.get("/auth/me", response_model=UserResponse)
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
):
    try:
        user = auth_service.get_current_user(credentials.credentials)
    except (InvalidTokenError, UserNotFoundError) as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    return user