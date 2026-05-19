import os


class Settings:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://orders_user:orders_pass@postgres_orders:5432/orders_db"
    )
    APP_NAME = "Orders Service"
    APP_VERSION = "1.0.0"

    # JWT — должен совпадать с auth_service
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "super-secret-jwt-key-change-me-in-production-12345"
    )
    ALGORITHM = "HS256"

    # Ключ для общения с goods_service
    INTERNAL_API_KEY = os.getenv(
        "INTERNAL_API_KEY",
        "internal-service-key-change-me-12345"
    )


settings = Settings()