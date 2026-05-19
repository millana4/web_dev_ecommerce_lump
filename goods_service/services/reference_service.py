from typing import List
from models import Socle, Shape, Type as LampType, Supplier
from repositories.reference_repository import ReferenceRepository
from schemas import SocleCreate, ShapeCreate, TypeCreate, SupplierCreate
from core.exceptions import ReferenceNotFoundError


class ReferenceService:
    def __init__(self, ref_repo: ReferenceRepository):
        self.ref_repo = ref_repo

    # --- Socles ---
    def list_socles(self) -> List[Socle]:
        return self.ref_repo.list_socles()

    def create_socle(self, data: SocleCreate) -> Socle:
        return self.ref_repo.save_socle(Socle(title=data.title))

    def delete_socle(self, socle_id: int) -> None:
        socle = self.ref_repo.get_socle(socle_id)
        if socle is None:
            raise ReferenceNotFoundError("Цоколь не найден")
        self.ref_repo.delete_socle(socle)

    # --- Shapes ---
    def list_shapes(self) -> List[Shape]:
        return self.ref_repo.list_shapes()

    def create_shape(self, data: ShapeCreate) -> Shape:
        return self.ref_repo.save_shape(Shape(title=data.title))

    def delete_shape(self, shape_id: int) -> None:
        shape = self.ref_repo.get_shape(shape_id)
        if shape is None:
            raise ReferenceNotFoundError("Форма не найдена")
        self.ref_repo.delete_shape(shape)

    # --- Types ---
    def list_types(self) -> List[LampType]:
        return self.ref_repo.list_types()

    def create_type(self, data: TypeCreate) -> LampType:
        return self.ref_repo.save_type(LampType(title=data.title))

    def delete_type(self, type_id: int) -> None:
        type_ = self.ref_repo.get_type(type_id)
        if type_ is None:
            raise ReferenceNotFoundError("Тип не найден")
        self.ref_repo.delete_type(type_)

    # --- Suppliers ---
    def list_suppliers(self) -> List[Supplier]:
        return self.ref_repo.list_suppliers()

    def create_supplier(self, data: SupplierCreate) -> Supplier:
        return self.ref_repo.save_supplier(Supplier(name=data.name))

    def delete_supplier(self, supplier_id: int) -> None:
        supplier = self.ref_repo.get_supplier(supplier_id)
        if supplier is None:
            raise ReferenceNotFoundError("Поставщик не найден")
        self.ref_repo.delete_supplier(supplier)