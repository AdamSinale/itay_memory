"""Soldier ORM entity - English table."""
import uuid
from sqlalchemy import Column, Date, String, Text
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class SoldierEn(Base):
    """Fallen soldier record - English."""
    __tablename__ = "soldiers_en"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=False)
    unit = Column(String(255), nullable=False)
    photo_url = Column(String(500), nullable=True)
    gender = Column(String(20), nullable=True)
    caption = Column(Text, nullable=True)
    birth_date = Column(Date, nullable=True)
    memorial_date = Column(Date, nullable=True)
