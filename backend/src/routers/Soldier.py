"""Soldier API routes."""
import os
import uuid
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import SoldierSchema
from src.services.Soldier import (
    create_soldier_he_sync,
    create_soldier_en_sync,
    get_closest_bd_soldier,
    get_closest_memorial_soldier,
    get_all_soldiers,
    get_featured_soldiers,
    get_random_soldiers,
    get_soldier_by_name,
    get_soldier_by_id,
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

router = APIRouter(prefix="/soldiers", tags=["soldiers"])

HERO_SOLDIER_NAME_HE = "איתי פריזט"
HERO_SOLDIER_NAME_EN = "Itay Parizat"


@router.get("/hero", response_model=SoldierSchema)
async def get_hero_soldier(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns the main soldier presented in the hero card (by name)."""
    hero_name = HERO_SOLDIER_NAME_HE if lang == "he" else HERO_SOLDIER_NAME_EN
    soldier = await get_soldier_by_name(db, hero_name, lang)
    if soldier is None:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return soldier


@router.get("/featured", response_model=list[SoldierSchema])
async def get_featured_soldiers_route(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns [closest birthday, 3 random, closest memorial]. Single request for the featured row."""
    return await get_featured_soldiers(db, limit=5, lang=lang)


@router.get("/random", response_model=list[SoldierSchema])
async def get_random_soldiers_route(
    lang: str = Query("he", pattern="^(he|en)$"),
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
    return await get_random_soldiers(db, limit=limit, lang=lang, exclude_ids=exclude_ids or None)


@router.get("/closest-birthday", response_model=SoldierSchema)
async def get_closest_birthday_soldier_route(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns a soldier whose birthday is closest to today (next occurrence). Random if several tie."""
    soldier = await get_closest_bd_soldier(db, lang)
    if soldier is None:
        raise HTTPException(status_code=404, detail="No soldier with birth date found")
    return soldier


@router.get("/closest-memorial", response_model=SoldierSchema)
async def get_closest_memorial_soldier_route(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns a soldier whose memorial date is closest to today (next occurrence). Random if several tie."""
    soldier = await get_closest_memorial_soldier(db, lang)
    if soldier is None:
        raise HTTPException(status_code=404, detail="No soldier with memorial date found")
    return soldier


@router.get("", response_model=list[SoldierSchema])
async def list_soldiers(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns all soldiers."""
    return await get_all_soldiers(db, lang)


def _parse_date(s: str | None) -> date | None:
    if not s or not s.strip():
        return None
    try:
        parts = s.strip().split("-")
        if len(parts) != 3:
            return None
        return date(int(parts[0]), int(parts[1]), int(parts[2]))
    except (ValueError, IndexError):
        return None


def _save_upload(file: UploadFile) -> str | None:
    """Save uploaded file to UPLOAD_DIR. Returns path like 'uploads/uuid.ext' or None."""
    if not file or not file.filename:
        return None
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return f"uploads/{name}"


@router.post("", response_model=SoldierSchema, status_code=201)
async def create_soldier_route(
    db: Session = Depends(get_db),
    is_hebrew: bool = Query(False),
    name: str = Form(...),
    rank: str = Form(...),
    unit: str = Form(...),
    caption: str = Form(...),
    birth_date: str | None = Form(None),
    memorial_date: str | None = Form(None),
    gender: str = Form(...),
    photo: UploadFile | None = File(None),
):
    if not name or not rank or not unit:
        raise HTTPException(status_code=400, detail="When name, rank and unit are required")

    birth_date = _parse_date(birth_date)
    memorial_date = _parse_date(memorial_date)
    photo_url = _save_upload(photo) if photo else None
    soldier_id = uuid.uuid4()

    create_soldier = create_soldier_he_sync if is_hebrew else create_soldier_en_sync
    create_soldier(db, soldier_id, name, rank, unit, caption, birth_date, memorial_date, gender, photo_url)
    db.commit()

    row = await get_soldier_by_id(db, soldier_id, "he")
    if row is None:
        raise HTTPException(status_code=500, detail="Failed to load created soldier")
    return row


@router.get("/{soldier_id}", response_model=SoldierSchema)
async def get_soldier_by_id_route(
    soldier_id: UUID,
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns a single soldier by id."""
    soldier = await get_soldier_by_id(db, soldier_id, lang)
    if soldier is None:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return soldier
