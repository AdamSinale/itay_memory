"""Seed placeholder data for development. Run from backend/ after DB is created."""
import json
import os
import sys
import uuid
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database import Base
from src.entities.SoldierHe import SoldierHe
from src.entities.SoldierEn import SoldierEn
from src.services.Soldier import create_soldier_he_sync, create_soldier_en_sync

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./memorial.db")
if DATABASE_URL.startswith("sqlite"):
    if not DATABASE_URL.startswith("sqlite:///"):
        DATABASE_URL = "sqlite:///./memorial.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
Session = sessionmaker(bind=engine)

SOLDIER_COUNT = 0


SOLDIERS_DIR = os.path.join(os.path.dirname(__file__), "soldiers")


def parse_date(date_str: str | None) -> date | None:
    """Parse a date string (YYYY-MM-DD) to a date object."""
    if not date_str:
        return None
    parts = date_str.split("-")
    return date(int(parts[0]), int(parts[1]), int(parts[2]))


def load_soldier_json(filename: str) -> dict:
    global SOLDIER_COUNT
    """Load a soldier JSON from the soldiers/ folder."""
    path = os.path.join(SOLDIERS_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        SOLDIER_COUNT += 1
        return json.load(f)


def soldier_json_to_row(data: dict, sid: uuid.UUID) -> dict:
    """Convert a soldier JSON (he/en captions) to a soldiers_data row."""
    return {
        "id": sid,
        "name_he": data["he"]["name"],
        "name_en": data["en"]["name"],
        "rank_he": data["he"]["rank"],
        "rank_en": data["en"]["rank"],
        "unit_he": data["he"]["unit"],
        "unit_en": data["en"]["unit"],
        "photo_url": data.get("photo_url"),
        "gender": data.get("gender"),
        "caption_he": data["he"]["caption"],
        "caption_en": data["en"]["caption"],
        "birth_date": parse_date(data.get("birth_date")),
        "memorial_date": parse_date(data.get("memorial_date")),
    }


def seed(force_reseed=False):
    Base.metadata.create_all(bind=engine)
    db = Session()
    try:
        itay_data = load_soldier_json("itay_data.json")
        shay_data = load_soldier_json("shay_data.json")
        reuven_data = load_soldier_json("reuven_data.json")
        shachar_data = load_soldier_json("shachar_data.json")

        existing_he = db.query(SoldierHe).count()
        existing_en = db.query(SoldierEn).count()
        
        if existing_he == SOLDIER_COUNT and existing_en == SOLDIER_COUNT and not force_reseed:
            print(f"DB already has {SOLDIER_COUNT} soldiers in each table, skipping seed.")
            return
        
        if force_reseed:
            db.query(SoldierHe).delete()
            db.query(SoldierEn).delete()
            db.commit()
            print(f"Cleared existing soldiers, seeding {SOLDIER_COUNT} per table.")
        elif existing_he > 0 or existing_en > 0:
            print(f"Data already exists (he={existing_he}, en={existing_en}). Run with --force to reset.")
            return


        soldiers_data = [
            soldier_json_to_row(itay_data, uuid.uuid4()),
            soldier_json_to_row(shay_data, uuid.uuid4()),
            soldier_json_to_row(reuven_data, uuid.uuid4()),
            soldier_json_to_row(shachar_data, uuid.uuid4()),
        ]

        for data in soldiers_data:
            create_soldier_he_sync(
                db,
                soldier_id=data["id"],
                name=data["name_he"],
                rank=data["rank_he"],
                unit=data["unit_he"],
                caption=data["caption_he"],
                birth_date=data["birth_date"],
                memorial_date=data["memorial_date"],
                gender=data["gender"],
                photo_url=data["photo_url"],
            )
            create_soldier_en_sync(
                db,
                soldier_id=data["id"],
                name=data["name_en"],
                rank=data["rank_en"],
                unit=data["unit_en"],
                caption=data["caption_en"],
                birth_date=data["birth_date"],
                memorial_date=data["memorial_date"],
                gender=data["gender"],
                photo_url=data["photo_url"],
            )


        db.commit()
        print(f"Seed completed: {len(soldiers_data)} soldiers in each table (he + en).")
    finally:
        db.close()


if __name__ == "__main__":
    force = "--force" in sys.argv or "-f" in sys.argv
    seed(force_reseed=force)
