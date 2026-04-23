from sqlalchemy import Column, Integer, String, Float, TIMESTAMP, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)  # VARCHAR, не INT
    customer_email = Column(String, nullable=False)
    order_comment = Column(String, nullable=True)
    status = Column(String, nullable=False, default="NEW")  # NEW, PROCESSING, SHIPPED, COMPLETED
    total_price = Column(Float, nullable=False, default=0.0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    good_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # цена за единицу в момент заказа


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    good_id = Column(Integer, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())