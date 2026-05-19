from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from core.config import settings
from core.security import decode_access_token


# HTTPBearer автоматически читает заголовок Authorization: Bearer <token>.
# Если заголовка нет — FastAPI сам возвращает 403 ещё до нашего кода.
security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Зависимость FastAPI: проверяет, что в запросе есть валидный JWT
    с ролью admin. Возвращает payload токена.
    """
    token = credentials.credentials

    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный или просроченный токен",
        )

    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав. Требуется роль admin.",
        )

    return payload


def verify_internal_api_key(
    x_internal_api_key: str = Header(None, alias="X-Internal-Api-Key"),
):
    """
    Проверяет, что запрос пришёл от другого нашего микросервиса
    через общий внутренний ключ. Используется для межсервисных вызовов
    (например, orders_service → goods_service при обновлении остатков).
    """
    if x_internal_api_key != settings.INTERNAL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid internal API key",
        )