"""Soldier ORM entity."""
import uuid
from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class Soldier(Base):
    """Fallen soldier record."""
    __tablename__ = "soldiers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=False)
    unit = Column(String(255), nullable=False)
    photo_url = Column(String(500), nullable=True)
    gender = Column(String(20), nullable=True)
    caption_en = Column(Text, nullable=True)
    caption_he = Column(Text, nullable=True)
