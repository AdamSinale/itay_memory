"""Soldier API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import SoldierSchema
from src.services.Soldier import get_random_soldiers, get_all_soldiers, get_soldier_by_name

router = APIRouter(prefix="/soldiers", tags=["soldiers"])

FEATURED_LIMIT = 5
HERO_SOLDIER_NAME = "Itay Parizat"


@router.get("/hero", response_model=SoldierSchema)
async def get_hero_soldier(db: Session = Depends(get_db)):
    """Returns the main soldier presented in the hero card (by name)."""
    soldier = await get_soldier_by_name(db, HERO_SOLDIER_NAME)
    if soldier is None:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return soldier


@router.get("/featured", response_model=list[SoldierSchema])
async def get_featured_soldiers(db: Session = Depends(get_db)):
    """Returns 5 soldiers chosen randomly for the hero/featured section."""
    return await get_random_soldiers(db, FEATURED_LIMIT)


@router.get("", response_model=list[SoldierSchema])
async def list_soldiers(db: Session = Depends(get_db)):
    """Returns all soldiers."""
    return await get_all_soldiers(db)
