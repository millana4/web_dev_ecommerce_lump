from typing import List
from models import Order, OrderItem
from repositories.order_repository import OrderRepository
from services.goods_client import GoodsClient
from schemas import OrderCreate, StatusUpdate
from core.exceptions import OrderNotFoundError, InsufficientStockError


class OrderService:
    def __init__(self, order_repo: OrderRepository, goods_client: GoodsClient):
        self.order_repo = order_repo
        self.goods_client = goods_client

    def create_order(self, data: OrderCreate) -> Order:
        """
        Создаёт заказ. Цены берутся из Goods Service, а не от клиента.
        """
        total_price = 0.0
        items_to_create = []

        # Шаг 1: для каждой позиции проверяем товар и берём ЦЕНУ С СЕРВЕРА
        for item in data.items:
            good = self.goods_client.get_good(item.good_id)  # кинет GoodNotFoundError если что

            if good["quantity"] < item.quantity:
                raise InsufficientStockError(
                    f"Недостаточно товара '{good['title']}'. "
                    f"В наличии: {good['quantity']}, запрошено: {item.quantity}"
                )

            server_price = float(good["price"])  # ← цена с сервера, не от клиента
            total_price += server_price * item.quantity

            items_to_create.append({
                "good_id": item.good_id,
                "quantity": item.quantity,
                "price": server_price,
            })

        # Шаг 2: создаём заказ
        order = Order(
            customer_name=data.customer_name,
            customer_phone=data.customer_phone,
            customer_email=data.customer_email,
            order_comment=data.order_comment,
            status="NEW",
            total_price=total_price,
        )
        order = self.order_repo.save(order)

        # Шаг 3: позиции
        for item_data in items_to_create:
            self.order_repo.add_item(OrderItem(
                order_id=order.order_id,
                good_id=item_data["good_id"],
                quantity=item_data["quantity"],
                price=item_data["price"],
            ))

        # Шаг 4: уменьшаем остатки (если не получится — заказ всё равно создан)
        for item in data.items:
            self.goods_client.change_quantity(item.good_id, -item.quantity)

        # Возвращаем с подгруженными items, чтобы Pydantic мог их сериализовать
        return self.order_repo.get_by_id_with_items(order.order_id)

    def list_orders(self, skip: int = 0, limit: int = 100) -> List[Order]:
        return self.order_repo.list(skip, limit)

    def get_order(self, order_id: int) -> Order:
        order = self.order_repo.get_by_id_with_items(order_id)
        if order is None:
            raise OrderNotFoundError("Заказ не найден")
        return order

    def update_status(self, order_id: int, data: StatusUpdate) -> Order:
        order = self.order_repo.get_by_id(order_id)
        if order is None:
            raise OrderNotFoundError("Заказ не найден")
        order.status = data.status
        self.order_repo.commit()
        return order