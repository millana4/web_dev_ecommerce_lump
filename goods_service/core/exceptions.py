class DomainError(Exception):
    pass


class GoodNotFoundError(DomainError):
    pass


class ReferenceNotFoundError(DomainError):
    pass


class InsufficientStockError(DomainError):
    pass


class UnauthorizedError(DomainError):
    """Нет токена или токен невалидный."""


class ForbiddenError(DomainError):
    """Токен валидный, но недостаточно прав."""