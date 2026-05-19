from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from core.exceptions import GoodNotFoundError, ReferenceNotFoundError, InsufficientStockError
from repositories.good_repository import GoodRepository
from repositories.reference_repository import ReferenceRepository
from services.good_service import GoodService
from services.reference_service import ReferenceService
from api.dependencies import get_current_admin, verify_internal_api_key
from schemas import (
    GoodResponse, GoodCreate, GoodUpdate, QuantityChange,
    SocleResponse, SocleCreate, ShapeResponse, ShapeCreate,
    TypeResponse, TypeCreate, SupplierResponse, SupplierCreate,
)

router = APIRouter()


def get_good_service(db: Session = Depends(get_db)) -> GoodService:
    return GoodService(GoodRepository(db))


def get_reference_service(db: Session = Depends(get_db)) -> ReferenceService:
    return ReferenceService(ReferenceRepository(db))


# ========== GOODS ==========

@router.get("/goods", response_model=list[GoodResponse])
def get_goods(
    socle_id: Optional[int] = Query(None),
    shape_id: Optional[int] = Query(None),
    type_id: Optional[int] = Query(None),
    is_visible: Optional[bool] = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    service: GoodService = Depends(get_good_service),
):
    return service.list_goods(socle_id, shape_id, type_id, is_visible, skip, limit)


@router.post("/goods", response_model=GoodResponse, status_code=201)
def create_good(
    good: GoodCreate,
    service: GoodService = Depends(get_good_service),
    admin: dict = Depends(get_current_admin),
):
    return service.create_good(good)


@router.get("/goods/{good_id}", response_model=GoodResponse)
def get_good(good_id: int, service: GoodService = Depends(get_good_service)):
    try:
        return service.get_good(good_id)
    except GoodNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/goods/{good_id}", response_model=GoodResponse)
def update_good(
    good_id: int,
    data: GoodUpdate,
    service: GoodService = Depends(get_good_service),
    admin: dict = Depends(get_current_admin),
):
    try:
        return service.update_good(good_id, data)
    except GoodNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch(
    "/goods/{good_id}/quantity",
    response_model=GoodResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
def change_quantity(
    good_id: int,
    data: QuantityChange,
    service: GoodService = Depends(get_good_service),
):
    """Межсервисный: orders_service шлёт X-Internal-Api-Key."""
    try:
        return service.change_quantity(good_id, data.quantity_change)
    except GoodNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except InsufficientStockError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/goods/{good_id}", status_code=204)
def delete_good(
    good_id: int,
    service: GoodService = Depends(get_good_service),
    admin: dict = Depends(get_current_admin),
):
    try:
        service.soft_delete_good(good_id)
    except GoodNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ========== SOCLES ==========

@router.get("/socles", response_model=list[SocleResponse])
def get_socles(service: ReferenceService = Depends(get_reference_service)):
    return service.list_socles()


@router.post("/socles", response_model=SocleResponse, status_code=201)
def create_socle(
    data: SocleCreate,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    return service.create_socle(data)


@router.delete("/socles/{socle_id}", status_code=204)
def delete_socle(
    socle_id: int,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    try:
        service.delete_socle(socle_id)
    except ReferenceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ========== SHAPES ==========

@router.get("/shapes", response_model=list[ShapeResponse])
def get_shapes(service: ReferenceService = Depends(get_reference_service)):
    return service.list_shapes()


@router.post("/shapes", response_model=ShapeResponse, status_code=201)
def create_shape(
    data: ShapeCreate,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    return service.create_shape(data)


@router.delete("/shapes/{shape_id}", status_code=204)
def delete_shape(
    shape_id: int,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    try:
        service.delete_shape(shape_id)
    except ReferenceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ========== TYPES ==========

@router.get("/types", response_model=list[TypeResponse])
def get_types(service: ReferenceService = Depends(get_reference_service)):
    return service.list_types()


@router.post("/types", response_model=TypeResponse, status_code=201)
def create_type(
    data: TypeCreate,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    return service.create_type(data)


@router.delete("/types/{type_id}", status_code=204)
def delete_type(
    type_id: int,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    try:
        service.delete_type(type_id)
    except ReferenceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ========== SUPPLIERS ==========

@router.get("/suppliers", response_model=list[SupplierResponse])
def get_suppliers(
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    return service.list_suppliers()


@router.post("/suppliers", response_model=SupplierResponse, status_code=201)
def create_supplier(
    data: SupplierCreate,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    return service.create_supplier(data)


@router.delete("/suppliers/{supplier_id}", status_code=204)
def delete_supplier(
    supplier_id: int,
    service: ReferenceService = Depends(get_reference_service),
    admin: dict = Depends(get_current_admin),
):
    try:
        service.delete_supplier(supplier_id)
    except ReferenceNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))