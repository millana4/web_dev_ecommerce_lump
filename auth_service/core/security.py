from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt, JWTError
from passlib.context import CryptContext

from core.config import settings


# ========== ХЕШИРОВАНИЕ ПАРОЛЕЙ ==========

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """
    Превращает обычный пароль в bcrypt-хеш.
    Соль генерируется автоматически и встраивается в сам хеш.
    """
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Проверяет, соответствует ли введённый пароль сохранённому хешу.
    """
    return pwd_context.verify(plain_password, hashed_password)


# ========== JWT ==========

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Создаёт подписанный JWT-токен.

    data — произвольный словарь с данными о юзере, которые попадут в payload.
    Например: {"sub": "admin", "role": "admin"}.
    Стандартное поле "sub" (subject) — это имя/идентификатор владельца токена.

    К нашим данным добавляется поле "exp" (expiration) — момент истечения.
    Библиотека jose потом сама будет проверять его при декодировании.
    """
    to_encode = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Декодирует и проверяет токен.
    Возвращает payload (словарь) если всё ок, или None если токен
    невалидный/просроченный/с битой подписью.

    Эта функция пригодится и здесь (для /auth/me), и в других сервисах
    (goods, orders) — мы её туда скопируем на следующем шаге.
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