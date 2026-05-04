from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import ActiveDiscount
from schemas import ActiveDiscountResponse
from database import get_db

router = APIRouter()

@router.get("/discount/active", response_model=ActiveDiscountResponse)
def get_active_discount(db: Session = Depends(get_db)):
    discount = db.query(ActiveDiscount).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Акция не найдена")
    return discount