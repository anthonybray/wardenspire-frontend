# Wardenspire – Implementation Stack

## Overview

- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite by default; Postgres when you set `DATABASE_URL`
- **Frontend**: React, Vite, TypeScript

The frontend talks to the backend over HTTP (JSON). The backend is stateless and uses the database for persistence.

## Backend (Python / FastAPI)

- **Location**: `backend/`
- **Virtualenv**: Use a venv for dependencies (e.g. `python -m venv .venv` in `backend/`, then `source .venv/bin/activate`). Install with `pip install -r requirements.txt`. The repo `.gitignore` excludes `.venv/` and `venv/`.
- **Run**: From `backend/` with the venv activated, run `python run.py` or `uvicorn app.main:app --reload --port 8000`
- **Database URL**: Set `DATABASE_URL` in `backend/.env` or environment. Default: `sqlite:///./wardenspire.db`
- **Postgres**: Install `psycopg2-binary`, set `DATABASE_URL=postgresql://user:pass@host/dbname`. No code changes required; SQLAlchemy and the existing models work with both.

## Database (SQLite → Postgres)

- Tables: `tenants`, `zones`, `incidents`, `tasks` (see `backend/app/models.py`).
- Migrations: This repo does not yet use Alembic. For production, add Alembic and version your schema; for now, `Base.metadata.create_all(bind=engine)` on startup creates tables.
- Switching to Postgres: Use the same models and CRUD; only the engine and connection string change. Optional: enable Postgres-specific features (e.g. JSONB, PostGIS) later if needed.

## Frontend (React)

- **Location**: `frontend/`
- **Run**: `npm run dev` (Vite dev server on port 5173).
- **API**: Vite proxy sends `/api` to `http://localhost:8000` so the app can call `/api/tenants/...` etc. without CORS issues in development.

### Map

- **Library**: [Leaflet](https://leafletjs.com/) with [react-leaflet](https://react-leaflet.js.org/).
- **Tiles**: OpenStreetMap (`https://{s}.tile.openstreetmap.org/...`). No API key; no usage cost for normal use.
- **Data**: Zone polygons from `GET /api/tenants/{id}/zones` (each zone includes `geometry` GeoJSON). Incident locations from the incidents API (`lat`, `lng`). The map view is filtered by the zone selector (single zone or all zones); bounds are fitted to the visible zone(s).

## Implementation status

Phase 1 (foundational zones) of the [Zone Architecture](wardenspire-zone-architecture.md) is implemented: Zone entity and CRUD, tenant `default_zone_id`, point-in-polygon resolution, incidents and tasks with `zone_id`, browser zone selector and filtered lists, PWA-style report flow (GPS → resolve zone → create incident), and the **Zone editor** tab (create, edit, archive zones; draw polygon on map). See the [README](../README.md) for a quick summary and the architecture doc for the full roadmap.

## Docs

- [Wardenspire Zone Architecture](wardenspire-zone-architecture.md) – Zones, data model, permissions, roadmap.
- [Map (Leaflet + OSM)](map.md) – Map stack, data flow, and implementation notes.
- [Zone Editor](zone-editor.md) – Zone management tab: create, edit, archive zones; draw polygon on map.
- [Priority Gaps Roadmap](roadmap.md) – The six highest-priority gaps (auth, audit, governance, offline, media, notifications) and their dependency order.
