# Wardenspire – Map (Leaflet + OpenStreetMap)

The dashboard map shows zone boundaries and incident locations. It replaces the previous map placeholder.

## Tech choice

- **Leaflet** for the map; **react-leaflet** for React integration.
- **OpenStreetMap** tiles for the base layer. No API key or account is required. Tile usage is free for typical use; for heavy production use see [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).

## Data flow

- **Zones**: The app loads zones via `GET /api/tenants/{tenant_id}/zones`. Each zone includes a `geometry` field (GeoJSON Polygon). The map draws these as polygons; when a single zone is selected, only that zone is shown and the map fits its bounds; when “All” is selected, all zones are shown and the map fits all zone bounds.
- **Incidents**: Incidents are already loaded for the lists (filtered by zone when a zone is selected). The map shows markers at each incident’s `lat`/`lng`; a popup shows category and description. Only incidents for the currently selected zone(s) are shown.

No extra API calls are made for the map; it uses the same `zones` and `incidents` state as the rest of the dashboard.

## Implementation note

The previous placeholder component (`MapPlaceholder.tsx`) was removed. The map is implemented in `frontend/src/ZoneMap.tsx`, which receives `zones`, `incidents`, and `selectedZoneId` from `App.tsx`.
