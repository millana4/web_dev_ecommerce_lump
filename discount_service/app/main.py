from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from crud import router
from config import Settings
from models import ActiveDiscount
from sqlalchemy.orm import Session

settings = Settings()

# Создаем таблицы
Base.metadata.create_all(bind=engine)


# Функция для заполнения моковых данных
def init_mock_data():
    db = Session(bind=engine)

    # Создаём моковую акцию, если её нет
    if db.query(ActiveDiscount).count() == 0:
        discount = ActiveDiscount(
            is_active=True,
            discount_percent=10,
            title="Скидка на все лампочки",
            description="Только сегодня скидка на все лампочки 10%",
            ends_at=None
        )
        db.add(discount)
        db.commit()

    db.close()


# Заполняем моковые данные при запуске
init_mock_data()

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

# Добавляем CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1", tags=["discount"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "discount"}