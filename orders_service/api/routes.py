from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.exceptions import (
    OrderNotFoundError, GoodNotFoundError, InsufficientStockError,
    GoodsServiceUnavailableError, ReviewError,
)
from repositories.order_repository import OrderRepository
from repositories.review_repository import ReviewRepository
from services.order_service import OrderService
from services.review_service import ReviewService
from services.goods_client import GoodsClient
from api.dependencies import get_current_admin
from schemas import (
    OrderCreate, OrderResponse, OrderWithItemsResponse,
    StatusUpdate, ReviewCreate, ReviewResponse,
)

router = APIRouter()


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(OrderRepository(db), GoodsClient())


def get_review_service(db: Session = Depends(get_db)) -> ReviewService:
    return ReviewService(ReviewRepository(db), OrderRepository(db))


@router.post("/orders", response_model=OrderWithItemsResponse, status_code=201)
def create_order(data: OrderCreate, service: OrderService = Depends(get_order_service)):
    """Публичный: покупатель оформляет заказ."""
    try:
        return service.create_order(data)
    except GoodNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except InsufficientStockError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except GoodsServiceUnavailableError as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/orders", response_model=list[OrderResponse])
def get_orders(
    skip: int = 0,
    limit: int = 100,
    service: OrderService = Depends(get_order_service),
    admin: dict = Depends(get_current_admin),
):
    """Только админ."""
    return service.list_orders(skip, limit)


@router.get("/orders/{order_id}", response_model=OrderWithItemsResponse)
def get_order(
    order_id: int,
    service: OrderService = Depends(get_order_service),
    admin: dict = Depends(get_current_admin),
):
    """Только админ."""
    try:
        return service.get_order(order_id)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    data: StatusUpdate,
    service: OrderService = Depends(get_order_service),
    admin: dict = Depends(get_current_admin),
):
    """Только админ."""
    try:
        return service.update_status(order_id, data)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/orders/{order_id}/reviews", response_model=ReviewResponse, status_code=201)
def add_review(
    order_id: int,
    data: ReviewCreate,
    service: ReviewService = Depends(get_review_service),
):
    """Публичный: покупатель оставляет отзыв."""
    try:
        return service.create_review(order_id, data)
    except OrderNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ReviewError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reviews", response_model=list[ReviewResponse])
def get_reviews(
    good_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    service: ReviewService = Depends(get_review_service),
):
    """Публичный: показ отзывов на витрине."""
    return service.list_reviews(good_id, skip, limit)