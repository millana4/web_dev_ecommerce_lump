from models import ActiveDiscount
from repositories.discount_repository import DiscountRepository
from core.exceptions import DiscountNotFoundError


class DiscountService:
    def __init__(self, repo: DiscountRepository):
        self.repo = repo

    def get_active(self) -> ActiveDiscount:
        discount = self.repo.get_active()
        if discount is None:
            raise DiscountNotFoundError("Акция не найдена")
        return discount