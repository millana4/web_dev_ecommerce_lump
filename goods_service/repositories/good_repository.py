from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models import Good


class GoodRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, good_id: int) -> Optional[Good]:
        return self.db.query(Good).filter(Good.good_id == good_id).first()

    def list(
        self,
        socle_id: Optional[int] = None,
        shape_id: Optional[int] = None,
        type_id: Optional[int] = None,
        is_visible: Optional[bool] = True,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Good]:
        query = self.db.query(Good)
        filters = []
        if socle_id is not None:
            filters.append(Good.socle_id == socle_id)
        if shape_id is not None:
            filters.append(Good.shape_id == shape_id)
        if type_id is not None:
            filters.append(Good.type_id == type_id)
        if is_visible is not None:
            filters.append(Good.is_visible == is_visible)
        if filters:
            query = query.filter(and_(*filters))
        return query.offset(skip).limit(limit).all()

    def save(self, good: Good) -> Good:
        self.db.add(good)
        self.db.commit()
        self.db.refresh(good)
        return good

    def update(self, good: Good) -> Good:
        self.db.commit()
        self.db.refresh(good)
        return good