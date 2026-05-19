class DomainError(Exception):
    """Базовое доменное исключение."""


class InvalidCredentialsError(DomainError):
    """Неверный логин или пароль."""


class InvalidTokenError(DomainError):
    """Невалидный или просроченный токен."""


class UserNotFoundError(DomainError):
    """Пользователь не найден."""