from typing import Optional, List
from models import Good
from repositories.good_repository import GoodRepository
from schemas import GoodCreate, GoodUpdate
from core.exceptions import GoodNotFoundError, InsufficientStockError


class GoodService:
    def __init__(self, good_repo: GoodRepository):
        self.good_repo = good_repo

    def list_goods(self, socle_id=None, shape_id=None, type_id=None,
                   is_visible=True, skip=0, limit=100) -> List[Good]:
        return self.good_repo.list(socle_id, shape_id, type_id, is_visible, skip, limit)

    def get_good(self, good_id: int) -> Good:
        good = self.good_repo.get_by_id(good_id)
        if good is None:
            raise GoodNotFoundError(f"Товар с ID {good_id} не найден")
        return good

    def create_good(self, data: GoodCreate) -> Good:
        good = Good(**data.model_dump())
        return self.good_repo.save(good)

    def update_good(self, good_id: int, data: GoodUpdate) -> Good:
        good = self.get_good(good_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(good, field, value)
        return self.good_repo.update(good)

    def change_quantity(self, good_id: int, delta: int) -> Good:
        good = self.get_good(good_id)
        new_quantity = good.quantity + delta
        if new_quantity < 0:
            raise InsufficientStockError("Недостаточно товара на складе")
        good.quantity = new_quantity
        return self.good_repo.update(good)

    def soft_delete_good(self, good_id: int) -> None:
        good = self.get_good(good_id)
        good.is_visible = False
        self.good_repo.update(good)