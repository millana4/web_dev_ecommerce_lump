from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.exceptions import DiscountNotFoundError
from repositories.discount_repository import DiscountRepository
from services.discount_service import DiscountService
from schemas import ActiveDiscountResponse

router = APIRouter()


def get_discount_service(db: Session = Depends(get_db)) -> DiscountService:
    return DiscountService(DiscountRepository(db))


@router.get("/discount/active", response_model=ActiveDiscountResponse)
def get_active_discount(service: DiscountService = Depends(get_discount_service)):
    try:
        return service.get_active()
    except DiscountNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))