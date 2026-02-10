"""Pydantic request/response schemas."""
from uuid import UUID
from pydantic import BaseModel


class SoldierSchema(BaseModel):
    """Soldier API response."""
    id: UUID
    name: str
    rank: str
    unit: str
    photo_url: str | None
    gender: str | None
    caption_en: str | None
    caption_he: str | None

    class Config:
        from_attributes = True


class AboutSchema(BaseModel):
    """About page API response."""
    mission_text_he: str | None
    mission_text_en: str | None
    donation_phone: str | None

    class Config:
        from_attributes = True


class PayPalLinkSchema(BaseModel):
    """PayPal donation button config from backend."""
    hosted_button_id: str | None = None
    donate_url: str | None = None
