from typing import Optional
from sqlalchemy.orm import Session
from models import ActiveDiscount


class DiscountRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(self) -> Optional[ActiveDiscount]:
        return self.db.query(ActiveDiscount).first()