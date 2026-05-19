from typing import Optional, List
from models import Review
from repositories.review_repository import ReviewRepository
from repositories.order_repository import OrderRepository
from schemas import ReviewCreate
from core.exceptions import OrderNotFoundError, ReviewError


class ReviewService:
    def __init__(self, review_repo: ReviewRepository, order_repo: OrderRepository):
        self.review_repo = review_repo
        self.order_repo = order_repo

    def create_review(self, order_id: int, data: ReviewCreate) -> Review:
        if self.order_repo.get_by_id(order_id) is None:
            raise OrderNotFoundError("Заказ не найден")

        if not self.review_repo.order_item_exists(order_id, data.good_id):
            raise ReviewError("Товар не найден в данном заказе")

        if self.review_repo.find(order_id, data.good_id) is not None:
            raise ReviewError("Отзыв на этот товар уже оставлен")

        return self.review_repo.save(Review(
            order_id=order_id,
            good_id=data.good_id,
            rating=data.rating,
            comment=data.comment,
        ))

    def list_reviews(self, good_id: Optional[int] = None,
                     skip: int = 0, limit: int = 100) -> List[Review]:
        return self.review_repo.list_by_good(good_id, skip, limit)