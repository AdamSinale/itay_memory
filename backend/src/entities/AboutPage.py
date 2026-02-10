"""About page ORM entity."""
import uuid
from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID

from src.database import Base


class AboutPage(Base):
    """Singleton content for the About / Foundation purpose page."""
    __tablename__ = "about_page"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mission_text_he = Column(Text, nullable=True)
    mission_text_en = Column(Text, nullable=True)
    donation_phone = Column(String(50), nullable=True)
