from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from schemas import GoodResponse, GoodCreate, GoodUpdate, QuantityChange, SocleResponse, SocleCreate, ShapeResponse, ShapeCreate, TypeResponse, TypeCreate, SupplierResponse, SupplierCreate
from models import Good, Socle, Shape, Type, Supplier
from database import get_db

router = APIRouter()


@router.get("/goods", response_model=list[GoodResponse])
def get_goods(
        socle_id: Optional[int] = Query(None, description="ID цоколя"),
        shape_id: Optional[int] = Query(None, description="ID формы"),
        type_id: Optional[int] = Query(None, description="ID типа"),
        is_visible: Optional[bool] = Query(True, description="Только видимые товары"),
        skip: int = Query(0, ge=0, description="Пропустить N записей"),
        limit: int = Query(100, ge=1, le=100, description="Лимит записей"),
        db: Session = Depends(get_db)
):
    """Получить список товаров с фильтрацией"""
    query = db.query(Good)

    # Фильтры
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

    # Пагинация
    goods = query.offset(skip).limit(limit).all()

    return goods


@router.post("/goods", response_model=GoodResponse, status_code=201)
def create_good(good: GoodCreate, db: Session = Depends(get_db)):
    """Создать новый товар"""
    db_good = Good(
        socle_id=good.socle_id,
        shape_id=good.shape_id,
        type_id=good.type_id,
        title=good.title,
        price=good.price,
        quantity=good.quantity,
        description=good.description,
        size=good.size,
        illumination=good.illumination,
        power=good.power,
        awaited_delivery_time=good.awaited_delivery_time,
        is_visible=good.is_visible
    )
    db.add(db_good)
    db.commit()
    db.refresh(db_good)
    return db_good

@router.get("/goods/{good_id}", response_model=GoodResponse)
def get_good(good_id: int, db: Session = Depends(get_db)):
    """Получить товар по ID"""
    good = db.query(Good).filter(Good.good_id == good_id).first()
    if not good:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return good


@router.put("/goods/{good_id}", response_model=GoodResponse)
def update_good(good_id: int, good_update: GoodUpdate, db: Session = Depends(get_db)):
    """Полностью обновить товар"""
    good = db.query(Good).filter(Good.good_id == good_id).first()
    if not good:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Обновляем только переданные поля
    for field, value in good_update.model_dump(exclude_unset=True).items():
        setattr(good, field, value)

    db.commit()
    db.refresh(good)
    return good


@router.patch("/goods/{good_id}/quantity", response_model=GoodResponse)
def change_quantity(
        good_id: int,
        quantity_change: QuantityChange,
        db: Session = Depends(get_db)
):
    """Изменить количество товара на складе"""
    good = db.query(Good).filter(Good.good_id == good_id).first()
    if not good:
        raise HTTPException(status_code=404, detail="Товар не найден")

    new_quantity = good.quantity + quantity_change.quantity_change
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Недостаточно товара на складе")

    good.quantity = new_quantity
    db.commit()
    db.refresh(good)
    return good


@router.delete("/goods/{good_id}", status_code=204)
def delete_good(good_id: int, db: Session = Depends(get_db)):
    """Удалить товар (мягкое удаление - скрыть)"""
    good = db.query(Good).filter(Good.good_id == good_id).first()
    if not good:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Мягкое удаление - просто скрываем
    good.is_visible = False
    db.commit()
    return None

# ========== SOCLE CRUD ==========

@router.get("/socles", response_model=list[SocleResponse])
def get_socles(db: Session = Depends(get_db)):
    """Получить список всех цоколей"""
    return db.query(Socle).all()

@router.post("/socles", response_model=SocleResponse, status_code=201)
def create_socle(socle: SocleCreate, db: Session = Depends(get_db)):
    """Создать новый цоколь"""
    db_socle = Socle(title=socle.title)
    db.add(db_socle)
    db.commit()
    db.refresh(db_socle)
    return db_socle

@router.delete("/socles/{socle_id}", status_code=204)
def delete_socle(socle_id: int, db: Session = Depends(get_db)):
    """Удалить цоколь"""
    socle = db.query(Socle).filter(Socle.socle_id == socle_id).first()
    if not socle:
        raise HTTPException(status_code=404, detail="Цоколь не найден")
    db.delete(socle)
    db.commit()
    return None

# ========== SHAPE CRUD ==========

@router.get("/shapes", response_model=list[ShapeResponse])
def get_shapes(db: Session = Depends(get_db)):
    """Получить список всех форм"""
    return db.query(Shape).all()

@router.post("/shapes", response_model=ShapeResponse, status_code=201)
def create_shape(shape: ShapeCreate, db: Session = Depends(get_db)):
    """Создать новую форму"""
    db_shape = Shape(title=shape.title)
    db.add(db_shape)
    db.commit()
    db.refresh(db_shape)
    return db_shape

@router.delete("/shapes/{shape_id}", status_code=204)
def delete_shape(shape_id: int, db: Session = Depends(get_db)):
    """Удалить форму"""
    shape = db.query(Shape).filter(Shape.shape_id == shape_id).first()
    if not shape:
        raise HTTPException(status_code=404, detail="Форма не найдена")
    db.delete(shape)
    db.commit()
    return None

# ========== TYPE CRUD ==========

@router.get("/types", response_model=list[TypeResponse])
def get_types(db: Session = Depends(get_db)):
    """Получить список всех типов ламп"""
    return db.query(Type).all()

@router.post("/types", response_model=TypeResponse, status_code=201)
def create_type(type_: TypeCreate, db: Session = Depends(get_db)):
    """Создать новый тип лампы"""
    db_type = Type(title=type_.title)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

@router.delete("/types/{type_id}", status_code=204)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    """Удалить тип лампы"""
    type_ = db.query(Type).filter(Type.type_id == type_id).first()
    if not type_:
        raise HTTPException(status_code=404, detail="Тип не найден")
    db.delete(type_)
    db.commit()
    return None

# ========== SUPPLIER CRUD ==========

@router.get("/suppliers", response_model=list[SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    """Получить список всех поставщиков"""
    return db.query(Supplier).all()

@router.post("/suppliers", response_model=SupplierResponse, status_code=201)
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    """Создать нового поставщика"""
    db_supplier = Supplier(name=supplier.name)
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.delete("/suppliers/{supplier_id}", status_code=204)
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Удалить поставщика"""
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Поставщик не найден")
    db.delete(supplier)
    db.commit()
    return None
