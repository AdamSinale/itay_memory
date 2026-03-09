"""Soldier ORM entity - single table with Hebrew and English fields."""
import uuid
from sqlalchemy import Column, Date, String, Text
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base

ALLOWED_GENDERS = ("זכר", "נקבה")

ALLOWED_RANKS = {
    "טוראי (טור׳)": "Private",
    "טוראי ראשון (טר״ש)": "Lance Corporal",
    "רב טוראי (רב״ט)": "Corporal",
    "סמל (סמ״ל)": "Sergeant",
    "סמל ראשון (סמ״ר)": "First Sergeant",
    "רב סמל (רס״ל)": "Master Sergeant",
    "רב סמל ראשון (רס״ר)": "Sergeant First Class",
    "רב סמל מתקדם (רס״מ)": "Advanced Sergeant Major",
    "רב סמל בכיר (רס״ב)": "Senior Sergeant Major",
    "רב סמל ראשון בכיר (רס״ב״ר)": "Senior First Sergeant",
    "סגן משנה (סג״מ)": "Second Lieutenant",
    "סגן (סג״ן)": "Lieutenant",
    "סרן (סרן)": "Captain",
    "רב סרן (רס״ן)": "Major",
    "סגן אלוף (סא״ל)": "Lieutenant Colonel",
    "אלוף משנה (אל״ם)": "Colonel",
    "תת אלוף (תא״ל)": "Brigadier General",
    "אלוף (אלוף)": "Major General",
    "רב אלוף (רא״ל)": "Lieutenant General",
    "קצין מקצועי אקדמאי (קמ״א)": "Academic Professional Officer",
    "קצין אקדמאי בכיר (קא״ב)": "Senior Academic Officer",
    "קצין מקצועי שיניים (קמ״ש)": "Dental Professional Officer",
    "רבץ (רב״ץ)": "Quartermaster",
    "קרפ (קר״פ)": "Corps Quartermaster",
    "קצין אקדמאי מיוחד (קא״ם)": "Special Academic Officer",
}


class Soldier(Base):
    """Fallen soldier record - single row with name_he/name_en, caption_he/caption_en."""
    __tablename__ = "soldiers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_he = Column(String(255), nullable=False, default="")
    name_en = Column(String(255), nullable=False, default="")
    caption_he = Column(Text, nullable=True)
    caption_en = Column(Text, nullable=True)
    rank = Column(String(100), nullable=False)
    unit = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=True)
    memorial_date = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    photo_url = Column(String(500), nullable=True)
