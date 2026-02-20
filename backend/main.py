"""FastAPI application for Fallen Soldiers Memorial API."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import engine, Base
from src.entities import SoldierHe, SoldierEn, AboutPage  # noqa: F401 - register tables
from src.routers.Soldier import router as soldiers_router
from src.routers.About import router as about_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup."""
    Base.metadata.create_all(bind=engine)
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
