import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://goods_user:goods_pass@postgres_goods:5432/goods_db")
    APP_NAME = "Goods Service"
    APP_VERSION = "1.0.0"

settings = Settings()