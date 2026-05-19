from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActiveDiscountBase(BaseModel):
    is_active: bool = True
    discount_percent: int = 10
    title: str = "Скидка на все лампочки"
    description: Optional[str] = "Только сегодня скидка на все лампочки 10%"
    ends_at: Optional[datetime] = None


class ActiveDiscountResponse(ActiveDiscountBase):
    id: int
    started_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DiscountHistoryResponse(BaseModel):
    id: int
    discount_percent: int
    title: str
    description: Optional[str]
    started_at: datetime
    ended_at: datetime
    created_by: Optional[str]

    class Config:
        from_attributes = True