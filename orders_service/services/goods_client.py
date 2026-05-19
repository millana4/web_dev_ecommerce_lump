import os
import httpx
from typing import Optional
from core.exceptions import GoodNotFoundError, GoodsServiceUnavailableError


class GoodsClient:
    """Клиент для общения с Goods Service по HTTP."""

    def __init__(self):
        self.base_url = os.getenv("GOODS_SERVICE_URL", "http://goods_service:8000")
        self.internal_key = os.getenv("INTERNAL_API_KEY", "")

    def get_good(self, good_id: int) -> dict:
        try:
            with httpx.Client() as client:
                response = client.get(f"{self.base_url}/api/v1/goods/{good_id}")
        except httpx.RequestError:
            raise GoodsServiceUnavailableError("Не удалось подключиться к Goods Service")

        if response.status_code == 404:
            raise GoodNotFoundError(f"Товар с ID {good_id} не найден")
        if response.status_code != 200:
            raise GoodsServiceUnavailableError("Goods Service недоступен")
        return response.json()

    def change_quantity(self, good_id: int, delta: int) -> Optional[dict]:
        """
        Уменьшает остаток. Эндпоинт защищён X-Internal-Api-Key,
        потому что это межсервисный вызов, а не пользовательский.
        """
        try:
            with httpx.Client() as client:
                response = client.patch(
                    f"{self.base_url}/api/v1/goods/{good_id}/quantity",
                    json={"quantity_change": delta},
                    headers={"X-Internal-Api-Key": self.internal_key},
                )
                if response.status_code == 200:
                    return response.json()
                print(f"Warning: Failed to update quantity for good {good_id} (status {response.status_code})")
                return None
        except httpx.RequestError:
            print(f"Warning: Failed to connect to Goods Service for good {good_id}")
            return None