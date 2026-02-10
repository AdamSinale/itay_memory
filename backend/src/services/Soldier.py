"""Soldier business logic."""
import asyncio
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.entities.Soldier import Soldier

HERO_SOLDIER_NAME = "Itay Parizat"


def _get_soldier_by_name_sync(db: Session, name: str) -> Soldier | None:
    """Return the soldier with the given name, or None if not found."""
    return db.query(Soldier).filter(Soldier.name == name).first()


async def get_soldier_by_name(db: Session, name: str = HERO_SOLDIER_NAME) -> Soldier | None:
    """Return the soldier with the given name, or None if not found."""
    return await asyncio.to_thread(_get_soldier_by_name_sync, db, name)


def _get_random_soldiers_sync(db: Session, limit: int) -> list[Soldier]:
    """Return up to `limit` soldiers chosen randomly from the database."""
    total = db.query(Soldier).count()
    if total == 0:
        return []
    if total <= limit:
        return list(db.query(Soldier).all())
    return list(
        db.query(Soldier)
        .filter(Soldier.name != HERO_SOLDIER_NAME)
        .order_by(func.random())
        .limit(limit)
        .all()
    )


async def get_random_soldiers(db: Session, limit: int = 5) -> list[Soldier]:
    """Return up to `limit` soldiers chosen randomly from the database."""
    return await asyncio.to_thread(_get_random_soldiers_sync, db, limit)


def _get_all_soldiers_sync(db: Session) -> list[Soldier]:
    """Return all soldiers."""
    return list(db.query(Soldier).all())


async def get_all_soldiers(db: Session) -> list[Soldier]:
    """Return all soldiers."""
    return await asyncio.to_thread(_get_all_soldiers_sync, db)
