from models import User
from repositories.user_repository import UserRepository
from core.security import verify_password, create_access_token, decode_access_token
from core.exceptions import InvalidCredentialsError, InvalidTokenError, UserNotFoundError


class AuthService:
    """Бизнес-логика аутентификации. Ничего не знает про HTTP."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def authenticate(self, username: str, password: str) -> str:
        """
        Проверяет логин/пароль, возвращает JWT.
        Кидает InvalidCredentialsError, если пара неверная.
        """
        user = self.user_repo.get_by_username(username)
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError("Неверный логин или пароль")

        token = create_access_token(data={
            "sub": str(user.id),
            "username": user.username,
            "role": user.role.value,
        })
        return token

    def get_current_user(self, token: str) -> User:
        """
        Возвращает юзера по токену.
        Кидает InvalidTokenError или UserNotFoundError.
        """
        payload = decode_access_token(token)
        if payload is None:
            raise InvalidTokenError("Невалидный или просроченный токен")

        user_id = payload.get("sub")
        if user_id is None:
            raise InvalidTokenError("Битый токен")

        user = self.user_repo.get_by_id(int(user_id))
        if user is None:
            raise UserNotFoundError("Пользователь не найден")

        return user