import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://discount_user:discount_pass@postgres_discount:5432/discount_db")
    APP_NAME = "Discount Service"
    APP_VERSION = "1.0.0"

settings = Settings()