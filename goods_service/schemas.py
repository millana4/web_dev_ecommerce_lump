from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class GoodBase(BaseModel):
    socle_id: Optional[int] = None
    shape_id: Optional[int] = None
    type_id: Optional[int] = None
    title: str
    price: float
    quantity: int = 0
    description: Optional[str] = None
    size: Optional[float] = None
    illumination: Optional[int] = None
    power: Optional[int] = None
    awaited_delivery_time: Optional[datetime] = None
    is_visible: bool = True


class GoodCreate(GoodBase):
    pass


class GoodUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    description: Optional[str] = None
    size: Optional[float] = None
    illumination: Optional[int] = None
    power: Optional[int] = None
    awaited_delivery_time: Optional[datetime] = None
    is_visible: Optional[bool] = None
    socle_id: Optional[int] = None
    shape_id: Optional[int] = None
    type_id: Optional[int] = None


class GoodResponse(GoodBase):
    good_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuantityChange(BaseModel):
    quantity_change: int


# Schemas для Socle
class SocleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=50)


class SocleCreate(SocleBase):
    pass


class SocleResponse(SocleBase):
    socle_id: int

    class Config:
        from_attributes = True


# Schemas для Shape
class ShapeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=50)


class ShapeCreate(ShapeBase):
    pass


class ShapeResponse(ShapeBase):
    shape_id: int

    class Config:
        from_attributes = True


# Schemas для Type
class TypeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=50)


class TypeCreate(TypeBase):
    pass


class TypeResponse(TypeBase):
    type_id: int

    class Config:
        from_attributes = True


# Schemas для Supplier
class SupplierBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class SupplierCreate(SupplierBase):
    pass


class SupplierResponse(SupplierBase):
    supplier_id: int

    class Config:
        from_attributes = True