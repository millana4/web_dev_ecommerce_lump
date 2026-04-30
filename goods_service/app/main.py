from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from crud import router
from config import Settings
from models import Socle, Shape, Type, Supplier
from sqlalchemy.orm import Session

settings = Settings()

# Создаем таблицы
Base.metadata.create_all(bind=engine)


# Функция для заполнения начальных данных
def init_mock_data():
    db = Session(bind=engine)

    if db.query(Socle).count() == 0:
        socles = [
            Socle(title="E27"),
            Socle(title="E14"),
            Socle(title="GU10"),
            Socle(title="G4"),
            Socle(title="G9"),
        ]
        db.add_all(socles)

    if db.query(Shape).count() == 0:
        shapes = [
            Shape(title="Свеча"),
            Shape(title="Груша"),
            Shape(title="Трубка"),
        ]
        db.add_all(shapes)

    if db.query(Type).count() == 0:
        types = [
            Type(title="Светодиодная (LED)"),
            Type(title="Лампа накаливания"),
            Type(title="Галогенная"),
            Type(title="Люминесцентная"),
            Type(title="Ксеноновая"),
        ]
        db.add_all(types)

    if db.query(Supplier).count() == 0:
        suppliers = [
            Supplier(name="ООО 'Световые Технологии'"),
            Supplier(name="ИП Иванов А.А."),
            Supplier(name="ООО 'Лампочки РФ'"),
            Supplier(name="ЗАО 'ЭлектроСвет'"),
            Supplier(name="ООО 'LED Мир'"),
        ]
        db.add_all(suppliers)

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

app.include_router(router, prefix="/api/v1", tags=["goods"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "goods"}