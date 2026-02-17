"""Soldier business logic."""
import asyncio
import random
from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session

from src.entities.Soldier import Soldier

HERO_SOLDIER_NAME = "Itay Parizat"


def _days_until_next_month_day(today: date, d: date) -> int:
    """Days until the next occurrence of month-day (birthday-style)."""
    this_year = date(today.year, d.month, d.day)
    if this_year >= today:
        return (this_year - today).days
    next_year = date(today.year + 1, d.month, d.day)
    return (next_year - today).days


def _days_until_next_memorial(today: date, d: date) -> int:
    """Days until the next occurrence of memorial date."""
    return _days_until_next_month_day(today, d)


def _get_featured_soldiers_sync(db: Session, limit: int) -> list[Soldier]:
    """Return [closest birthday, 3 random others, closest memorial] using split functions."""
    first_soldier = _get_closest_bd_soldier_sync(db)
    last_soldier = _get_closest_memorial_soldier_sync(db)
    if last_soldier and first_soldier and last_soldier.id == first_soldier.id:
        last_soldier = None

    exclude_ids: list[UUID] = []
    if first_soldier:
        exclude_ids.append(first_soldier.id)
    if last_soldier:
        exclude_ids.append(last_soldier.id)

    middle = _get_random_soldiers_sync(db, limit=3, exclude_ids=exclude_ids)

    result = []
    if first_soldier:
        result.append(first_soldier)
    result.extend(middle)
    if last_soldier and last_soldier not in result:
        result.append(last_soldier)
    return result[:limit]


def _get_soldier_by_name_sync(db: Session, name: str) -> Soldier | None:
    """Return the soldier with the given name, or None if not found."""
    return db.query(Soldier).filter(Soldier.name == name).first()


async def get_soldier_by_name(db: Session, name: str = HERO_SOLDIER_NAME) -> Soldier | None:
    """Return the soldier with the given name, or None if not found."""
    return await asyncio.to_thread(_get_soldier_by_name_sync, db, name)


def _get_random_soldiers_sync(
    db: Session, limit: int, exclude_ids: list[UUID] | None = None
) -> list[Soldier]:
    """Return up to `limit` soldiers chosen randomly, excluding hero and any ids in exclude_ids."""
    exclude_ids = list(exclude_ids) if exclude_ids else []
    q = db.query(Soldier).filter(Soldier.name != HERO_SOLDIER_NAME)
    if exclude_ids:
        q = q.filter(Soldier.id.notin_(exclude_ids))
    candidates = list(q.all())
    if len(candidates) == 0:
        return []
    if len(candidates) <= limit:
        return random.sample(candidates, len(candidates))
    return random.sample(candidates, limit)


async def get_random_soldiers(
    db: Session, limit: int = 5, exclude_ids: list[UUID] | None = None
) -> list[Soldier]:
    """Return up to `limit` soldiers chosen randomly. Excludes hero and ids in exclude_ids."""
    return await asyncio.to_thread(_get_random_soldiers_sync, db, limit, exclude_ids)


async def get_featured_soldiers(db: Session, limit: int = 5) -> list[Soldier]:
    """Return featured soldiers: first=closest birthday, last=closest memorial date, rest random."""
    return await asyncio.to_thread(_get_featured_soldiers_sync, db, limit)


def _get_closest_bd_soldier_sync(db: Session) -> Soldier | None:
    """Return a soldier whose birthday is closest to today (next occurrence). Random if several tie."""
    soldiers_with_birth = [
        s for s in db.query(Soldier).filter(Soldier.birth_date.isnot(None)).all()
    ]
    if not soldiers_with_birth:
        return None
    today = date.today()
    with_days = [(s, _days_until_next_month_day(today, s.birth_date)) for s in soldiers_with_birth]
    min_days = min(d for _, d in with_days)
    closest = [s for s, d in with_days if d == min_days]
    return random.choice(closest)


def _get_closest_memorial_soldier_sync(db: Session) -> Soldier | None:
    """Return a soldier whose memorial date is closest to today (next occurrence). Random if several tie."""
    soldiers_with_memorial = [
        s for s in db.query(Soldier).filter(Soldier.memorial_date.isnot(None)).all()
    ]
    if not soldiers_with_memorial:
        return None
    today = date.today()
    with_days = [
        (s, _days_until_next_memorial(today, s.memorial_date)) for s in soldiers_with_memorial
    ]
    min_days = min(d for _, d in with_days)
    closest = [s for s, d in with_days if d == min_days]
    return random.choice(closest)


async def get_closest_bd_soldier(db: Session) -> Soldier | None:
    """Return a soldier whose birthday is closest to now. Random if multiple tie."""
    return await asyncio.to_thread(_get_closest_bd_soldier_sync, db)


async def get_closest_memorial_soldier(db: Session) -> Soldier | None:
    """Return a soldier whose memorial date is closest to now. Random if multiple tie."""
    return await asyncio.to_thread(_get_closest_memorial_soldier_sync, db)


def _get_all_soldiers_sync(db: Session) -> list[Soldier]:
    """Return all soldiers."""
    return list(db.query(Soldier).all())


async def get_all_soldiers(db: Session) -> list[Soldier]:
    """Return all soldiers."""
    return await asyncio.to_thread(_get_all_soldiers_sync, db)
