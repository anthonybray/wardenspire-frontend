# Zone Editor

The Zone Editor lets admins create, edit, and archive zones for a tenant. It is available as a separate tab (**Zones**) alongside the main **Dashboard**.

## Design

### Navigation

- **Dashboard** – Main view: zone selector, map, incidents, tasks, report form.
- **Zones** – Zone management: list of zones, add zone, edit zone, archive zone.

Tabs are shown at the top of the app; switching tabs does not change tenant context.

### Zone list

- Lists all zones for the current tenant (name, type, status).
- Actions per zone: **Edit** (open editor with existing geometry and metadata), **Archive** (set status to `archived`).
- **Add zone** button opens the create flow.

### Create zone flow

1. **Draw boundary** – A map is shown. User clicks on the map to add polygon vertices in order.
   - **Ghost line** – A dashed line from the last vertex to the cursor shows the next segment while drawing.
   - **Snap-to-close** – When the cursor is near the first vertex, a “Click to close the shape” hint appears; clicking there closes the polygon (same as the button).
   - Buttons: **Undo last point**, **Clear**, **Close shape** (or click on the first point to close). After closing: **×** (delete and redraw) or **Use this zone**.
2. **Details form** – Name (required), Zone type (dropdown), Description (optional).
3. **Save** – `POST /api/zones` with tenant_id, name, zone_type, description, geometry (GeoJSON Polygon), status `active`. On success, return to zone list and refresh.

**Shareable URL** – When a shape is closed on the Add zone screen, the boundary is encoded in the URL query (`?shape=...`). Sharing or bookmarking that URL reopens the Add zone form with the same shape so the user can confirm and fill details (or delete and redraw).

### Edit zone flow

1. From the zone list, user clicks **Edit** on a zone.
2. Form is pre-filled (name, type, description). Map shows the existing zone polygon.
3. **Edit boundary** – User can replace the shape: same drawing interaction as create (click to add points, Undo, Close shape). New geometry replaces the existing one on Save.
4. **Save** – `PATCH /api/zones/{zone_id}` with updated name, zone_type, description, and/or geometry. On success, return to zone list and refresh.

### Archive

- **Archive** sets the zone’s status to `archived` via `PATCH /api/zones/{zone_id}` with `status: "archived"`. Archived zones are still listed but can be visually de-emphasised; they are excluded from the dashboard zone selector and from point-in-polygon resolution (backend already filters by `status === "active"` where relevant).

## Geometry

- Zones are stored as **GeoJSON Polygon**: `{ type: "Polygon", coordinates: [ ring ] }` where `ring` is an array of `[lng, lat]` with the first point repeated at the end to close the ring.
- The editor collects points as [lat, lng] from the map (Leaflet’s convention) and converts to GeoJSON [lng, lat] when saving.
- Any shape is supported: the user draws by clicking vertices in order; the polygon can be convex, concave, or complex.

## API

- **List zones**: `GET /api/tenants/{tenant_id}/zones` (existing).
- **Create zone**: `POST /api/zones` with body `{ tenant_id, name, description?, zone_type, geometry, status? }`.
- **Update zone**: `PATCH /api/zones/{zone_id}` with body `{ name?, description?, zone_type?, geometry?, status? }`.
- **Get zone**: `GET /api/zones/{zone_id}` (existing) for loading a single zone when editing.

## Implementation notes

- **Polygon drawing**: Implemented in `PolygonDrawMap`: map click adds vertices; a ghost polyline from the last point to the cursor shows the next segment; snap-to-close (pixel distance to first point) allows closing by clicking near the start. Undo / Clear / Close shape buttons; after close, “×” to delete and redraw or “Use this zone” to confirm. Produces GeoJSON Polygon for the parent form.
- **URL shape**: `urlShape.ts` encodes/decodes the polygon’s first ring to a URL-safe string (base64url of JSON). When the user closes a shape on Add zone, the URL is updated; when opening Add zone with `?shape=...`, the shape is restored so the form can be shared or bookmarked.
- **No extra drawing library**: Drawing uses Leaflet’s click events, Polyline, and Polygon; no separate drawing library.
- The Dashboard and Zones tab share the same tenant; zone list and create/edit use the same tenant context.
