from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


# ========== ORDER ==========
class OrderItemCreate(BaseModel):
    good_id: int = Field(..., description="ID товара", example=1)
    quantity: int = Field(..., ge=1, example=2, description="Количество")
    price: float = Field(..., gt=0, example=499.99, description="Цена за единицу")

    class Config:
        json_schema_extra = {
            "example": {
                "good_id": 1,
                "quantity": 2,
                "price": 499.99
            }
        }


class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=100, example="Анна Иванова")
    customer_phone: str = Field(..., min_length=10, max_length=20, example="+79123456789")
    customer_email: str = Field(..., example="anna@example.com")
    order_comment: Optional[str] = Field(None, example="Позвонить перед доставкой")
    items: List[OrderItemCreate]

    @field_validator('customer_phone')
    def validate_phone(cls, v):
        digits = ''.join(filter(str.isdigit, v))
        if len(digits) < 10:
            raise ValueError('Номер телефона должен содержать минимум 10 цифр')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "customer_name": "Анна Иванова",
                "customer_phone": "+79123456789",
                "customer_email": "anna@example.com",
                "order_comment": "Позвонить перед доставкой",
                "items": [
                    {
                        "good_id": 1,
                        "quantity": 2,
                        "price": 499.99
                    }
                ]
            }
        }


class OrderResponse(BaseModel):
    order_id: int
    customer_name: str
    customer_phone: str
    customer_email: str
    order_comment: Optional[str]
    status: str
    total_price: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    order_item_id: int
    order_id: int
    good_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderWithItemsResponse(OrderResponse):
    items: List[OrderItemResponse]


# ========== STATUS UPDATE ==========
class StatusUpdate(BaseModel):
    status: str = Field(..., pattern=r'^(NEW|PROCESSING|SHIPPED|COMPLETED)$', example="PROCESSING")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "PROCESSING"
            }
        }


# ========== REVIEW ==========
class ReviewCreate(BaseModel):
    good_id: int = Field(..., example=1)
    rating: int = Field(..., ge=1, le=5, example=5)
    comment: Optional[str] = Field(None, max_length=1000, example="Отличная лампа!")

    class Config:
        json_schema_extra = {
            "example": {
                "good_id": 1,
                "rating": 5,
                "comment": "Отличная лампа, ярко светит!"
            }
        }


class ReviewResponse(BaseModel):
    review_id: int
    order_id: int
    good_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True