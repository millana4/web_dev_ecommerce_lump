import os


class Settings:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://goods_user:goods_pass@postgres_goods:5432/goods_db"
    )
    APP_NAME = "Goods Service"
    APP_VERSION = "1.0.0"

    # JWT — те же настройки, что в auth_service.
    # SECRET_KEY должен совпадать с auth_service, иначе подпись не сойдётся.
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "super-secret-jwt-key-change-me-in-production-12345"
    )
    ALGORITHM = "HS256"

    # Ключ для межсервисных вызовов
    INTERNAL_API_KEY = os.getenv(
        "INTERNAL_API_KEY",
        "internal-service-key-change-me-12345"
    )

settings = Settings()
