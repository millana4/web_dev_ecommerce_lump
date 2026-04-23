from fastapi import FastAPI
from database import engine, Base
from crud import router
from config import Settings

settings = Settings()

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.include_router(router, prefix="/api/v1", tags=["orders"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "orders"}