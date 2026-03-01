# Wardenspire

Multi-zone geospatial operational intelligence platform for town and city centres. Phase 1: Zones, incidents, tasks, and point-in-polygon resolution.

## Stack

- **Backend**: Python, [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: SQLite (default), with [SQLAlchemy](https://www.sqlalchemy.org/) so you can switch to **Postgres** by setting `DATABASE_URL`.
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)

See [docs/implementation-stack.md](docs/implementation-stack.md) for details and migration notes.

## Quick start

### Backend (API)

Use a **virtualenv** for the Python backend (recommended: `.venv` in `backend/`):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Keep the venv activated when running the API or tests.

API: **http://localhost:8000** · Docs: **http://localhost:8000/docs**

SQLite DB is created at `backend/wardenspire.db`. Seed creates one tenant (Shrewsbury BID) and two zones.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173** (proxies `/api` to the backend).

### Tests (backend)

```bash
cd backend
source .venv/bin/activate   # if not already active
pytest
```

## Phase 1 implemented

- Zone entity and CRUD, list-by-tenant
- Tenant with `default_zone_id`; resolve-zone (point-in-polygon + nearest-zone fallback)
- Incidents and tasks with `zone_id`; incident create resolves zone from lat/lng
- Browser: zone selector, **map** (Leaflet + OpenStreetMap tiles; zone boundaries and incident markers; respects zone filter; no API key), incident/task lists filtered by zone
- **Zone editor** tab: create, edit, and archive zones; draw zone boundary on the map (any polygon shape)
- PWA-style report: geolocation → resolve zone → create incident

Architecture: [docs/wardenspire-zone-architecture.md](docs/wardenspire-zone-architecture.md).

## Roadmap

The next phase of work targets six priority gaps: authentication, audit trails, data governance, offline PWA support, media storage, and notifications. See [docs/roadmap.md](docs/roadmap.md) for the full breakdown and dependency order.
