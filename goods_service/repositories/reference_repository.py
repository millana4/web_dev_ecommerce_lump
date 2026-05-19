from typing import Optional, List, Type
from sqlalchemy.orm import Session
from models import Socle, Shape, Type as LampType, Supplier


class ReferenceRepository:
    """Общий репозиторий для справочников: socles, shapes, types, suppliers."""

    def __init__(self, db: Session):
        self.db = db

    # --- Socles ---
    def list_socles(self) -> List[Socle]:
        return self.db.query(Socle).all()

    def get_socle(self, socle_id: int) -> Optional[Socle]:
        return self.db.query(Socle).filter(Socle.socle_id == socle_id).first()

    def save_socle(self, socle: Socle) -> Socle:
        self.db.add(socle); self.db.commit(); self.db.refresh(socle)
        return socle

    def delete_socle(self, socle: Socle):
        self.db.delete(socle); self.db.commit()

    # --- Shapes ---
    def list_shapes(self) -> List[Shape]:
        return self.db.query(Shape).all()

    def get_shape(self, shape_id: int) -> Optional[Shape]:
        return self.db.query(Shape).filter(Shape.shape_id == shape_id).first()

    def save_shape(self, shape: Shape) -> Shape:
        self.db.add(shape); self.db.commit(); self.db.refresh(shape)
        return shape

    def delete_shape(self, shape: Shape):
        self.db.delete(shape); self.db.commit()

    # --- Types ---
    def list_types(self) -> List[LampType]:
        return self.db.query(LampType).all()

    def get_type(self, type_id: int) -> Optional[LampType]:
        return self.db.query(LampType).filter(LampType.type_id == type_id).first()

    def save_type(self, type_: LampType) -> LampType:
        self.db.add(type_); self.db.commit(); self.db.refresh(type_)
        return type_

    def delete_type(self, type_: LampType):
        self.db.delete(type_); self.db.commit()

    # --- Suppliers ---
    def list_suppliers(self) -> List[Supplier]:
        return self.db.query(Supplier).all()

    def get_supplier(self, supplier_id: int) -> Optional[Supplier]:
        return self.db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()

    def save_supplier(self, supplier: Supplier) -> Supplier:
        self.db.add(supplier); self.db.commit(); self.db.refresh(supplier)
        return supplier

    def delete_supplier(self, supplier: Supplier):
        self.db.delete(supplier); self.db.commit()