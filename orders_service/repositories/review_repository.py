from typing import Optional, List
from sqlalchemy.orm import Session
from models import Review, OrderItem


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def find(self, order_id: int, good_id: int) -> Optional[Review]:
        return self.db.query(Review).filter(
            Review.order_id == order_id,
            Review.good_id == good_id,
        ).first()

    def list_by_good(self, good_id: Optional[int] = None,
                     skip: int = 0, limit: int = 100) -> List[Review]:
        query = self.db.query(Review)
        if good_id is not None:
            query = query.filter(Review.good_id == good_id)
        return query.offset(skip).limit(limit).all()

    def order_item_exists(self, order_id: int, good_id: int) -> bool:
        return self.db.query(OrderItem).filter(
            OrderItem.order_id == order_id,
            OrderItem.good_id == good_id,
        ).first() is not None

    def save(self, review: Review) -> Review:
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review