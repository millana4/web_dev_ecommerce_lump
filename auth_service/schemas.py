from pydantic import BaseModel, Field
from models import UserRole


# ========== ВХОДЯЩИЕ ==========

class LoginRequest(BaseModel):
    """Что присылает клиент при логине."""
    username: str = Field(..., min_length=1, max_length=50, example="admin")
    password: str = Field(..., min_length=1, example="admin123")


# ========== ИСХОДЯЩИЕ ==========

class TokenResponse(BaseModel):
    """Что отдаём клиенту после успешного логина."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Что отдаём в /auth/me — данные о текущем юзере (без пароля!)."""
    id: int
    username: str
    role: UserRole

    class Config:
        from_attributes = True