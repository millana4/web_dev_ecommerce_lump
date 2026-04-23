from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import httpx
import os
from schemas import OrderCreate, OrderResponse, OrderWithItemsResponse, StatusUpdate, ReviewCreate, ReviewResponse, \
    OrderItemCreate
from models import Order, OrderItem, Review
from database import get_db

router = APIRouter()

# URL Goods Service (из переменных окружения или по умолчанию)
GOODS_SERVICE_URL = os.getenv("GOODS_SERVICE_URL", "http://goods_service:8000")


@router.post("/orders", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Создать новый заказ"""

    # Шаг 1: Проверяем наличие товаров через Goods Service
    total_price = 0.0
    items_data = []

    for item in order.items:
        # Запрос к Goods Service для проверки товара
        try:
            with httpx.Client() as client:
                response = client.get(f"{GOODS_SERVICE_URL}/api/v1/goods/{item.good_id}")

                if response.status_code == 404:
                    raise HTTPException(status_code=400, detail=f"Товар с ID {item.good_id} не найден")

                if response.status_code != 200:
                    raise HTTPException(status_code=503, detail="Goods Service недоступен")

                good = response.json()

                # Проверяем количество на складе
                if good["quantity"] < item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Недостаточно товара '{good['title']}'. В наличии: {good['quantity']}, запрошено: {item.quantity}"
                    )

                # Считаем общую сумму
                item_total = item.price * item.quantity
                total_price += item_total

                items_data.append({
                    "good_id": item.good_id,
                    "quantity": item.quantity,
                    "price": item.price,
                    "good_title": good["title"]
                })

        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Не удалось подключиться к Goods Service")

    # Шаг 2: Создаём заказ в БД
    db_order = Order(
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        customer_email=order.customer_email,
        order_comment=order.order_comment,
        status="NEW",
        total_price=total_price
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Шаг 3: Создаём позиции заказа
    for item_data in items_data:
        db_item = OrderItem(
            order_id=db_order.order_id,
            good_id=item_data["good_id"],
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(db_item)

    # Шаг 4: Обновляем количество товаров в Goods Service
    for item in order.items:
        try:
            with httpx.Client() as client:
                # Уменьшаем количество на складе
                response = client.patch(
                    f"{GOODS_SERVICE_URL}/api/v1/goods/{item.good_id}/quantity",
                    json={"quantity_change": -item.quantity}
                )

                if response.status_code != 200:
                    # Логируем ошибку, но не отменяем заказ
                    print(f"Warning: Failed to update quantity for good {item.good_id}")

        except httpx.RequestError:
            print(f"Warning: Failed to connect to Goods Service for good {item.good_id}")

    db.commit()

    return db_order


@router.get("/orders", response_model=list[OrderResponse])
def get_orders(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
):
    """Получить список заказов"""
    orders = db.query(Order).offset(skip).limit(limit).all()
    return orders


@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Получить заказ по ID с позициями"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    # Возвращаем словарём, без Pydantic валидации
    return {
        "order_id": order.order_id,
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_email": order.customer_email,
        "order_comment": order.order_comment,
        "status": order.status,
        "total_price": order.total_price,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "updated_at": order.updated_at.isoformat() if order.updated_at else None,
        "items": [
            {
                "order_item_id": item.order_item_id,
                "order_id": item.order_id,
                "good_id": item.good_id,
                "quantity": item.quantity,
                "price": item.price
            }
            for item in items
        ]
    }


@router.put("/orders/{order_id}/status")
def update_order_status(
        order_id: int,
        status_update: StatusUpdate,
        db: Session = Depends(get_db)
):
    """Обновить статус заказа"""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    order.status = status_update.status
    db.commit()

    return {"message": f"Статус заказа {order_id} изменён на {status_update.status}"}


@router.post("/orders/{order_id}/reviews", response_model=ReviewResponse, status_code=201)
def add_review(
        order_id: int,
        review: ReviewCreate,
        db: Session = Depends(get_db)
):
    """Добавить отзыв на товар из заказа"""

    # Проверяем, существует ли заказ
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # Проверяем, что товар есть в заказе
    order_item = db.query(OrderItem).filter(
        OrderItem.order_id == order_id,
        OrderItem.good_id == review.good_id
    ).first()

    if not order_item:
        raise HTTPException(status_code=400, detail="Товар не найден в данном заказе")

    # Проверяем, не оставляли ли уже отзыв на этот товар в этом заказе
    existing_review = db.query(Review).filter(
        Review.order_id == order_id,
        Review.good_id == review.good_id
    ).first()

    if existing_review:
        raise HTTPException(status_code=400, detail="Отзыв на этот товар уже оставлен")

    # Создаём отзыв
    db_review = Review(
        order_id=order_id,
        good_id=review.good_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return db_review


@router.get("/reviews", response_model=list[ReviewResponse])
def get_reviews(
        good_id: int = None,
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
):
    """Получить отзывы (опционально фильтр по товару)"""
    query = db.query(Review)

    if good_id:
        query = query.filter(Review.good_id == good_id)

    reviews = query.offset(skip).limit(limit).all()
    return reviews