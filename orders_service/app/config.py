import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://orders_user:orders_pass@postgres_orders:5432/orders_db")
    APP_NAME = "Orders Service"
    APP_VERSION = "1.0.0"

settings = Settings()