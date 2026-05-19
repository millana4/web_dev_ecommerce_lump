from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from models import Order, OrderItem


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self.db.query(Order).filter(Order.order_id == order_id).first()

    def get_by_id_with_items(self, order_id: int) -> Optional[Order]:
        """Подтягивает items одним запросом (joinedload), чтобы не было N+1."""
        return (
            self.db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.order_id == order_id)
            .first()
        )

    def list(self, skip: int = 0, limit: int = 100) -> List[Order]:
        return self.db.query(Order).offset(skip).limit(limit).all()

    def save(self, order: Order) -> Order:
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def add_item(self, item: OrderItem) -> OrderItem:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def commit(self):
        self.db.commit()