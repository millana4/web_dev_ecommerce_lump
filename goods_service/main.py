from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from core.config import settings
from core.database import engine, Base
from models import Socle, Shape, Type, Supplier
from api.routes import router

Base.metadata.create_all(bind=engine)


def init_mock_data():
    db = Session(bind=engine)

    if db.query(Socle).count() == 0:
        db.add_all([
            Socle(title="E27"), Socle(title="E14"), Socle(title="GU10"),
            Socle(title="G4"), Socle(title="G9"),
        ])

    if db.query(Shape).count() == 0:
        db.add_all([Shape(title="Свеча"), Shape(title="Груша"), Shape(title="Трубка")])

    if db.query(Type).count() == 0:
        db.add_all([
            Type(title="Светодиодная (LED)"), Type(title="Лампа накаливания"),
            Type(title="Галогенная"), Type(title="Люминесцентная"), Type(title="Ксеноновая"),
        ])

    if db.query(Supplier).count() == 0:
        db.add_all([
            Supplier(name="ООО 'Световые Технологии'"),
            Supplier(name="ИП Иванов А.А."),
            Supplier(name="ООО 'Лампочки РФ'"),
            Supplier(name="ЗАО 'ЭлектроСвет'"),
            Supplier(name="ООО 'LED Мир'"),
        ])

    db.commit()
    db.close()


init_mock_data()

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

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