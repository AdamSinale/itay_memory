# Fallen Soldiers Memorial Website

A memorial website honoring fallen soldiers and supporting bereaved families. Two main pages (Homepage and About), full Hebrew/English support with RTL/LTR, soft gold/cream theme, and PayPal + phone donation options.

## Tech Stack

- **Frontend:** React (TypeScript), Vite, Mantine UI, React Router, TanStack React Query, react-i18next, Tabler Icons
- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL

## Setup

### Backend

1. Create a PostgreSQL database (e.g. `memorial_db`).
2. Copy environment file and set values:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: DATABASE_URL, optional PAYPAL_HOSTED_BUTTON_ID or PAYPAL_DONATE_URL
   ```
3. Install and run:
   ```bash
   pip install -r requirements.txt
   ```
   Then start the API (from `backend/`):
   - **Recommended:** `python run.py` (or `.\run.ps1` / `run.bat`) — reload is on but `seed_data.py` is excluded, so editing it won’t restart the server.
   - Avoid: `uvicorn main:app --reload` alone — that watches every file, so saving `seed_data.py` restarts the server and fills the log with cancellation messages.
   API runs at **http://localhost:8000**.

4. Seed placeholder data (optional):
   ```bash
   python seed_data.py
   ```
   Ensure `DATABASE_URL` in `.env` is correct. For seed images to work, run the frontend so `BASE_URL` can point to it, or leave default and use the SVG placeholder.

### Frontend

1. Copy env and set API URL:
   ```bash
   cd frontend
   cp .env.example .env
   # Set VITE_API_URL=http://localhost:8000 (or your backend URL)
   ```
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   App runs at **http://localhost:3000**.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/soldiers/featured` | Featured soldier for hero (nullable) |
| GET | `/soldiers` | List of all soldiers |
| GET | `/about` | Mission text (he/en) and donation phone |
| GET | `/donate/paypal-link` | PayPal button ID or donate URL |

## Environment Variables

**Backend (`.env`):**

- `DATABASE_URL` – PostgreSQL connection string (required)
- `PAYPAL_HOSTED_BUTTON_ID` – PayPal Donate hosted button ID (optional)
- `PAYPAL_DONATE_URL` – Full PayPal donate URL if not using hosted button (optional)

**Frontend (`.env`):**

- `VITE_API_URL` – Backend API base URL (e.g. `http://localhost:8000`)

## Features

- **Multilingual:** Hebrew and English with language toggle; RTL for Hebrew.
- **Homepage:** Hero section with featured soldier (from `/soldiers/featured`), grid of other soldiers (from `/soldiers`).
- **About:** Foundation mission text (from `/about`) and donation box (phone + PayPal).
- **PayPal:** Donate button uses `/donate/paypal-link` (hosted button ID or URL). Use PayPal sandbox for testing.
- **Responsive:** Layout adapts for mobile and desktop (Mantine Grid/breakpoints).
- **Placeholders:** `frontend/public/images/placeholder-soldier.svg` and seed script for development.

## Definition of Done (from spec)

- [x] Multilingual (Hebrew/English + RTL)
- [x] Homepage: hero soldier + soldier grid
- [x] About: mission text + donation box (phone + PayPal)
- [x] PayPal integration (button/link from backend)
- [x] Responsive layout
- [x] TypeScript frontend, Pydantic backend
- [x] Data via React Query
- [x] Placeholder images and seed data
- [x] `.env.example` for frontend and backend
- [x] README with setup and env docs

## Deployment

- **Frontend:** Build with `npm run build`; deploy to Vercel/Netlify; set `VITE_API_URL` to your API URL.
- **Backend:** Deploy to Railway/Heroku; set `DATABASE_URL`, PayPal vars; run with `uvicorn main:app --host 0.0.0.0 --port $PORT`.
