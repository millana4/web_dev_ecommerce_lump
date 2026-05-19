from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from core.config import settings
from core.database import engine, Base
from core.security import hash_password
from models import User, UserRole
from api.routes import router

Base.metadata.create_all(bind=engine)


def init_mock_data():
    db = Session(bind=engine)
    try:
        if db.query(User).filter(User.username == "admin").first() is None:
            admin = User(
                username="admin",
                hashed_password=hash_password("admin123"),
                role=UserRole.ADMIN,
            )
            db.add(admin)
            db.commit()
            print("Admin user created: login='admin', password='admin123'")
    finally:
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

app.include_router(router, prefix="/api/v1", tags=["auth"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "auth"}