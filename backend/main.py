"""FastAPI application for Fallen Soldiers Memorial API."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from src.database import engine, Base
from src.entities import Soldier, AboutPage  # noqa: F401 - register tables
from src.routers.Soldier import router as soldiers_router
from src.routers.About import router as about_router


def _migrate_add_gender():
    """Add gender column to soldiers if missing (e.g. DB created before column existed)."""
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE soldiers ADD COLUMN gender VARCHAR(20)"))
            conn.commit()
    except Exception as e:
        if "duplicate column name" not in str(e).lower():
            raise


def _migrate_drop_is_featured():
    """Drop is_featured column from soldiers (removed from model). SQLite 3.35+."""
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE soldiers DROP COLUMN is_featured"))
            conn.commit()
    except Exception as e:
        msg = str(e).lower()
        if "no such column" in msg or "syntax error" in msg or "not supported" in msg:
            pass  # column already gone or SQLite too old
        else:
            raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup and run any migrations."""
    Base.metadata.create_all(bind=engine)
    _migrate_add_gender()
    _migrate_drop_is_featured()
    yield


app = FastAPI(
    title="Fallen Soldiers Memorial API",
    description="API for memorial website: soldiers, about, donate",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(soldiers_router)
app.include_router(about_router)


@app.get("/health")
def health():
    """Health check."""
    return {"status": "ok"}
