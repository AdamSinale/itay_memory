"""Soldier API routes."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import SoldierSchema
from src.services.Soldier import (
    get_closest_bd_soldier,
    get_closest_memorial_soldier,
    get_all_soldiers,
    get_featured_soldiers,
    get_random_soldiers,
    get_soldier_by_name,
    get_soldier_by_id,
)

router = APIRouter(prefix="/soldiers", tags=["soldiers"])

HERO_SOLDIER_NAME = "Itay Parizat"


@router.get("/hero", response_model=SoldierSchema)
async def get_hero_soldier(db: Session = Depends(get_db)):
    """Returns the main soldier presented in the hero card (by name)."""
    soldier = await get_soldier_by_name(db, HERO_SOLDIER_NAME)
    if soldier is None:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return soldier


@router.get("/featured", response_model=list[SoldierSchema])
async def get_featured_soldiers_route(db: Session = Depends(get_db)):
    """Returns [closest birthday, 3 random, closest memorial]. Single request for the featured row."""
    return await get_featured_soldiers(db, limit=5)


@router.get("/random", response_model=list[SoldierSchema])
async def get_random_soldiers_route(
    db: Session = Depends(get_db),
    limit: int = Query(5, ge=1, le=20),
    exclude: str | None = Query(None, description="Comma-separated soldier IDs to exclude"),
):
    """Returns up to `limit` random soldiers (excluding hero). Optionally exclude given IDs."""
    exclude_ids: list[UUID] = []
    if exclude:
        for part in exclude.split(","):
            part = part.strip()
            if part:
                try:
                    exclude_ids.append(UUID(part))
                except ValueError:
                    pass
    return await get_random_soldiers(db, limit=limit, exclude_ids=exclude_ids or None)


@router.get("/closest-birthday", response_model=SoldierSchema)
async def get_closest_birthday_soldier_route(db: Session = Depends(get_db)):
    """Returns a soldier whose birthday is closest to today (next occurrence). Random if several tie."""
    soldier = await get_closest_bd_soldier(db)
    if soldier is None:
        raise HTTPException(status_code=404, detail="No soldier with birth date found")
    return soldier


@router.get("/closest-memorial", response_model=SoldierSchema)
async def get_closest_memorial_soldier_route(db: Session = Depends(get_db)):
    """Returns a soldier whose memorial date is closest to today (next occurrence). Random if several tie."""
    soldier = await get_closest_memorial_soldier(db)
    if soldier is None:
        raise HTTPException(status_code=404, detail="No soldier with memorial date found")
    return soldier


@router.get("", response_model=list[SoldierSchema])
async def list_soldiers(db: Session = Depends(get_db)):
    """Returns all soldiers."""
    return await get_all_soldiers(db)


@router.get("/{soldier_id}", response_model=SoldierSchema)
async def get_soldier_by_id_route(soldier_id: UUID, db: Session = Depends(get_db)):
    """Returns a single soldier by id."""
    soldier = await get_soldier_by_id(db, soldier_id)
    if soldier is None:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return soldier
