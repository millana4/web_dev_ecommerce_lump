class DomainError(Exception):
    pass


class OrderNotFoundError(DomainError):
    pass


class GoodNotFoundError(DomainError):
    pass


class InsufficientStockError(DomainError):
    pass


class GoodsServiceUnavailableError(DomainError):
    pass


class ReviewError(DomainError):
    pass


class UnauthorizedError(DomainError):
    pass


class ForbiddenError(DomainError):
    pass