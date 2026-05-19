import os


class Settings:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://auth_user:auth_pass@postgres_auth:5432/auth_db"
    )
    APP_NAME = "Auth Service"
    APP_VERSION = "1.0.0"

    # JWT настройки
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "super-secret-key-change-me-in-production-please-12345"
    )
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60


settings = Settings()