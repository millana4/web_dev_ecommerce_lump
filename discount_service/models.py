from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, Text
from sqlalchemy.sql import func
from core.database import Base


class ActiveDiscount(Base):
    __tablename__ = "active_discount"

    id = Column(Integer, primary_key=True, index=True)
    is_active = Column(Boolean, default=False)
    discount_percent = Column(Integer, nullable=False, default=10)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    started_at = Column(TIMESTAMP, server_default=func.now())
    ends_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class DiscountHistory(Base):
    __tablename__ = "discount_history"

    id = Column(Integer, primary_key=True, index=True)
    discount_percent = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    started_at = Column(TIMESTAMP, nullable=False)
    ended_at = Column(TIMESTAMP, nullable=False)
    created_by = Column(String(100), nullable=True)