"""About page and donate API routes."""
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.entities.AboutPage import AboutPage
from src.schemas import AboutSchema, PayPalLinkSchema

router = APIRouter(tags=["about"])


@router.get("/about", response_model=AboutSchema | None)
def get_about(db: Session = Depends(get_db)):
    """Returns mission text and donation phone for the About page."""
    row = db.query(AboutPage).first()
    if row is None:
        return AboutSchema(
            mission_text_he=None,
            mission_text_en=None,
            donation_phone=None,
        )
    return row


@router.get("/donate/paypal-link", response_model=PayPalLinkSchema)
def get_paypal_link():
    """Returns PayPal donation button parameters for the frontend."""
    hosted_button_id = os.getenv("PAYPAL_HOSTED_BUTTON_ID")
    donate_url = os.getenv("PAYPAL_DONATE_URL")
    return PayPalLinkSchema(
        hosted_button_id=hosted_button_id,
        donate_url=donate_url,
    )
