import enum
from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum as SQLEnum
from sqlalchemy.sql import func
from core.database import Base


class UserRole(str, enum.Enum):
    """
    Роли пользователей.
    Наследуемся от str + Enum, чтобы значения автоматически сериализовались
    в строки при возврате из API (Pydantic и FastAPI это хорошо понимают)
    и чтобы можно было сравнивать с обычными строками: UserRole.ADMIN == "admin".
    """
    ADMIN = "admin"
    USER = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        SQLEnum(UserRole, name="user_role"),
        nullable=False,
        default=UserRole.USER,
    )
    created_at = Column(TIMESTAMP, server_default=func.now())