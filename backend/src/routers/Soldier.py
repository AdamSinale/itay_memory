"""Soldier API routes."""
import os
import uuid
from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from src.database import get_db
from src.entities.Soldier import Soldier, ALLOWED_GENDERS, ALLOWED_RANKS
from src.schemas import SoldierSchema
from src.services.Soldier import (
    SoldierListFilters,
    create_soldier_sync,
    get_closest_bd_soldier,
    get_closest_memorial_soldier,
    get_featured_soldiers,
    get_random_soldiers,
    get_soldier_by_name,
    get_soldier_by_id,
    search_soldiers,
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

router = APIRouter(prefix="/soldiers", tags=["soldiers"])

HERO_SOLDIER_NAME_HE = "איתי פריזט"
HERO_SOLDIER_NAME_EN = "Itay Parizat"


def _normalize_rank_filter(rank: str | None) -> str | None:
    """Map rank query to stored Hebrew rank; accepts Hebrew key or English label."""
    if not rank or not rank.strip():
        return None
    r = rank.strip()
    if r in ALLOWED_RANKS:
        return r
    for k, en_label in ALLOWED_RANKS.items():
        if en_label == r:
            return k
    return r


def _row_to_schema(row: Soldier, lang: str) -> SoldierSchema:
    """Build API response schema from Soldier row and requested language."""
    rank = ALLOWED_RANKS.get(row.rank, row.rank) if lang == "en" else row.rank
    return SoldierSchema(
        id=row.id,
        name=row.name_he if lang == "he" else row.name_en,
        rank=rank,
        unit=row.unit,
        photo_url=row.photo_url,
        gender=row.gender,
        caption=row.caption_he if lang == "he" else row.caption_en,
        birth_date=row.birth_date,
        memorial_date=row.memorial_date,
    )


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
    return _row_to_schema(soldier, lang)


@router.get("/featured", response_model=list[SoldierSchema])
async def get_featured_soldiers_route(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns [closest birthday, 3 random, closest memorial]. Single request for the featured row."""
    rows = await get_featured_soldiers(db, limit=5, lang=lang)
    return [_row_to_schema(r, lang) for r in rows]


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
    rows = await get_random_soldiers(db, limit=limit, lang=lang, exclude_ids=exclude_ids or None)
    return [_row_to_schema(r, lang) for r in rows]


@router.get("/closest-birthday", response_model=SoldierSchema)
async def get_closest_birthday_soldier_route(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns a soldier whose birthday is closest to today (next occurrence). Random if several tie."""
    soldier = await get_closest_bd_soldier(db, lang)
    if soldier is None:
        raise HTTPException(status_code=404, detail="No soldier with birth date found")
    return _row_to_schema(soldier, lang)


@router.get("/closest-memorial", response_model=SoldierSchema)
async def get_closest_memorial_soldier_route(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
):
    """Returns a soldier whose memorial date is closest to today (next occurrence). Random if several tie."""
    soldier = await get_closest_memorial_soldier(db, lang)
    if soldier is None:
        raise HTTPException(status_code=404, detail="No soldier with memorial date found")
    return _row_to_schema(soldier, lang)


@router.get("", response_model=list[SoldierSchema])
async def list_soldiers(
    lang: str = Query("he", pattern="^(he|en)$"),
    db: Session = Depends(get_db),
    name: str | None = Query(None, description="Substring match on Hebrew or English name"),
    gender: str | None = Query(None),
    age_min: int | None = Query(None, ge=0, le=130),
    age_max: int | None = Query(None, ge=0, le=130),
    memorial_from: date | None = Query(None),
    memorial_to: date | None = Query(None),
    rank: str | None = Query(None, description="Rank: Hebrew key as stored, or English label if lang=en"),
    unit: str | None = Query(None, description="Substring match on unit"),
):
    """Returns all soldiers, optionally filtered."""
    if gender is not None and gender.strip() and gender.strip() not in ALLOWED_GENDERS:
        raise HTTPException(status_code=400, detail="Invalid gender")
    if age_min is not None and age_max is not None and age_min > age_max:
        raise HTTPException(status_code=400, detail="age_min must be <= age_max")
    if memorial_from is not None and memorial_to is not None and memorial_from > memorial_to:
        raise HTTPException(status_code=400, detail="memorial_from must be <= memorial_to")

    filters = SoldierListFilters(
        name=name.strip() if name and name.strip() else None,
        gender=gender.strip() if gender and gender.strip() else None,
        age_min=age_min,
        age_max=age_max,
        memorial_from=memorial_from,
        memorial_to=memorial_to,
        rank=_normalize_rank_filter(rank),
        unit=unit.strip() if unit and unit.strip() else None,
    )
    rows = await search_soldiers(db, filters)
    return [_row_to_schema(r, lang) for r in rows]


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
    # kept for backward-compatibility with existing frontend, but not used anymore
    is_hebrew: bool = Query(False, alias="isHebrew"),
    # frontend sends both languages explicitly
    name_he: str = Form(...),
    name_en: str = Form(...),
    rank: str = Form(...),
    unit: str = Form(...),
    caption_he: str | None = Form(None),
    caption_en: str | None = Form(None),
    birth_date: str | None = Form(None),
    memorial_date: str | None = Form(None),
    gender: str = Form(...),
    photo_url: str | None = Form(None),
    photo: UploadFile | None = File(None),
):
    # Basic required fields – both names, rank, unit
    if not name_he or not name_en or not rank or not unit:
        raise HTTPException(status_code=400, detail="name_he, name_en, rank and unit are required")

    if gender not in ALLOWED_GENDERS:
        raise HTTPException(
            status_code=400,
            detail=f"gender must be one of: {list(ALLOWED_GENDERS)}",
        )
    if rank not in ALLOWED_RANKS.keys():
        raise HTTPException(
            status_code=400,
            detail="rank must be one of the allowed Hebrew rank values",
        )

    birth_date_parsed = _parse_date(birth_date)
    memorial_date_parsed = _parse_date(memorial_date)
    photo_url = photo_url or (_save_upload(photo) if photo else None)
    soldier_id = uuid.uuid4()

    create_soldier_sync(
        db=db,
        soldier_id=soldier_id,
        name_he=name_he.strip(),
        name_en=name_en.strip(),
        caption_he=(caption_he.strip() if caption_he and caption_he.strip() else None),
        caption_en=(caption_en.strip() if caption_en and caption_en.strip() else None),
        rank=rank.strip(),
        unit=unit.strip(),
        birth_date=birth_date_parsed,
        memorial_date=memorial_date_parsed,
        gender=gender,
        photo_url=photo_url,
    )
    db.commit()

    row = await get_soldier_by_id(db, soldier_id, "he")
    if row is None:
        raise HTTPException(status_code=500, detail="Failed to load created soldier")
    return _row_to_schema(row, "he")


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
    return _row_to_schema(soldier, lang)
