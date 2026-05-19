from typing import Optional
from jose import jwt, JWTError
from core.config import settings


def decode_access_token(token: str) -> Optional[dict]:
    """
    Декодирует и проверяет JWT той же подписью, что использует auth_service.
    Возвращает payload, если токен валидный, иначе None.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        return None