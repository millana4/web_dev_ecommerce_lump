from sqlalchemy import Column, Integer, String, Float, Text, TIMESTAMP, Boolean, ForeignKey
from sqlalchemy.sql import func
from core.database import Base


class Good(Base):
    __tablename__ = "goods"

    good_id = Column(Integer, primary_key=True, index=True)
    socle_id = Column(Integer, ForeignKey("socles.socle_id"), nullable=True)
    shape_id = Column(Integer, ForeignKey("shapes.shape_id"), nullable=True)
    type_id = Column(Integer, ForeignKey("types.type_id"), nullable=True)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    description = Column(Text, nullable=True)
    size = Column(Float, nullable=True)
    illumination = Column(Integer, nullable=True)
    power = Column(Integer, nullable=True)
    awaited_delivery_time = Column(TIMESTAMP, nullable=True)
    is_visible = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class Socle(Base):
    __tablename__ = "socles"
    socle_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)


class Shape(Base):
    __tablename__ = "shapes"
    shape_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)


class Type(Base):
    __tablename__ = "types"
    type_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)


class Supplier(Base):
    __tablename__ = "suppliers"
    supplier_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


class SupplierToGood(Base):
    __tablename__ = "suppliers_to_goods"
    supplier_id = Column(Integer, ForeignKey("suppliers.supplier_id"), primary_key=True)
    good_id = Column(Integer, ForeignKey("goods.good_id"), primary_key=True)