"""Seed placeholder data for development. Run from backend/ after DB is created."""
import os
import sys
import uuid
from datetime import date

# Ensure backend root is on path so src can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from src.database import Base
from src.entities.Soldier import Soldier
from src.entities.AboutPage import AboutPage

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./memorial.db")
if DATABASE_URL.startswith("sqlite"):
    # Path relative to backend/ when running from backend
    if not DATABASE_URL.startswith("sqlite:///"):
        DATABASE_URL = "sqlite:///./memorial.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
Session = sessionmaker(bind=engine)


SOLDIER_COUNT = 4


def _migrate_schema():
    """Align DB schema with current model (e.g. add gender, drop is_featured)."""
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE soldiers ADD COLUMN gender VARCHAR(20)"))
            conn.commit()
        except Exception as e:
            if "duplicate column name" not in str(e).lower():
                raise
        try:
            conn.execute(text("ALTER TABLE soldiers DROP COLUMN is_featured"))
            conn.commit()
        except Exception as e:
            msg = str(e).lower()
            if "no such column" in msg or "syntax error" in msg or "not supported" in msg:
                pass
            else:
                raise
        for col in ("birth_date", "memorial_date"):
            try:
                conn.execute(text(f"ALTER TABLE soldiers ADD COLUMN {col} DATE"))
                conn.commit()
            except Exception as e:
                if "duplicate column name" not in str(e).lower():
                    raise


def seed(force_reseed=False):
    Base.metadata.create_all(bind=engine)
    _migrate_schema()
    db = Session()
    try:
        existing = db.query(Soldier).count()
        if existing == SOLDIER_COUNT and not force_reseed:
            print(f"DB already has {SOLDIER_COUNT} soldiers, skipping seed.")
            return
        if existing > 0 and force_reseed:
            db.query(Soldier).delete()
            db.commit()
            print(f"Cleared existing soldiers, seeding {SOLDIER_COUNT}.")
        elif existing > 0:
            print(f"Data already exists ({existing} soldiers). Run with --force to reset to {SOLDIER_COUNT}.")
            return

        base_url = os.getenv("BASE_URL", "http://localhost:3000")

        itays_bio_path = os.path.join(os.path.dirname(__file__), "itays_bio")
        with open(itays_bio_path, "r", encoding="utf-8") as f:
            itays_bio_content = f.read().strip()

        db.add(Soldier(
            id=uuid.uuid4(),
            name="Itay Parizat",
            rank="Sergeant",
            unit="Givati, Shaked",
            photo_url="itay.png",
            gender="male",
            caption_en="In memory of those who gave their all.",
            caption_he=itays_bio_content,
            birth_date=date(2004, 7, 15),
            memorial_date=date(2024, 11, 2),
        ))
        
        db.add(Soldier(
            id=uuid.uuid4(),
            name="Shay Arvas",
            rank="Sergeant",
            unit="Givati, Shaked",
            photo_url="shay.png",
            gender="male",
            caption_en="In memory of those who gave their all.",
            caption_he="לזכר נופלים שניצלו את חייהם בשביל ישראל.",
            birth_date=date(2003, 3, 26),
            memorial_date=date(2023, 10, 31),
        ))

        db.add(Soldier(
            id=uuid.uuid4(),
            name="Reuven Asulin",
            rank="Sergeant",
            unit="Givati, Shaked",
            photo_url="reuven.jpg",
            gender="male",
            caption_en="In memory of those who gave their all.",
            caption_he="לזכר נופלים שניצלו את חייהם בשביל ישראל.",
            birth_date=date(2004, 7, 19),
            memorial_date=date(2024, 5, 5),
        ))

        for i in range(SOLDIER_COUNT):
            db.add(Soldier(
                id=uuid.uuid4(),
                name=f"Soldier {i + 1}",
                rank="Sergeant" if i == 0 else ("Private" if i % 2 else "Corporal"),
                unit=f"Unit {((i % 3) + 1)}",
                photo_url=None,
                gender="male" if i % 3 != 1 else "female",
                caption_en="In memory of those who gave their all." if i == 0 else None,
                caption_he="לזכר נופלים שניצלו את חייהם בשביל ישראל." if i == 0 else None,
                birth_date=date(1990 + (i % 10), (i % 12) + 1, (i % 28) + 1),
                memorial_date=date(2023 + (i % 2), (i % 12) + 1, (i % 28) + 1),
            ))

        if not db.query(AboutPage).first():
            db.add(AboutPage(
                id=uuid.uuid4(),
                mission_text_he="טקסט המשימה של העמותה – לכבד את זכר הנופלים ולתמוך במשפחות השכולות.",
                mission_text_en="The foundation's mission is to honor the memory of the fallen and support bereaved families.",
                donation_phone="+972-2-1234567",
            ))

        db.commit()
        print(f"Seed completed: {SOLDIER_COUNT} soldiers.")
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv or "-f" in sys.argv
    seed(force_reseed=force)
