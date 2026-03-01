// ########################################
// ############ API client ##############
// ########################################

const API = '/api';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  default_zone_id: string | null;
}

export interface Zone {
  id: string;
  tenant_id: string;
  name: string;
  description?: string | null;
  zone_type: string;
  status: string;
  /** GeoJSON geometry (e.g. { type: 'Polygon', coordinates: [...] }) for map display */
  geometry: { type: string; coordinates: unknown };
}

export interface Incident {
  id: string;
  tenant_id: string;
  zone_id: string | null;
  created_at: string;
  category: string;
  description: string;
  status: string;
  lat: number;
  lng: number;
}

export interface Task {
  id: string;
  tenant_id: string;
  zone_id: string | null;
  incident_ids: string[];
  status: string;
  priority: string;
}

export interface ResolveZoneResponse {
  zone_id: string | null;
  unassigned: boolean;
}

export async function getTenant(id: string): Promise<Tenant> {
  const r = await fetch(`${API}/tenants/${id}`);
  if (!r.ok) throw new Error('Tenant not found');
  return r.json();
}

export async function getTenantBySlug(slug: string): Promise<Tenant> {
  const r = await fetch(`${API}/tenants/by-slug/${encodeURIComponent(slug)}`);
  if (!r.ok) throw new Error('Tenant not found');
  return r.json();
}

export async function getZones(tenantId: string): Promise<Zone[]> {
  const r = await fetch(`${API}/tenants/${tenantId}/zones`);
  if (!r.ok) throw new Error('Failed to load zones');
  const data = await r.json();
  return data.zones;
}

export async function resolveZone(tenantId: string, lat: number, lng: number, nearest = false): Promise<ResolveZoneResponse> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (nearest) params.set('nearest', 'true');
  const r = await fetch(`${API}/tenants/${tenantId}/resolve-zone?${params}`);
  if (!r.ok) throw new Error('Failed to resolve zone');
  return r.json();
}

export async function getIncidents(tenantId: string, zoneId?: string | null): Promise<Incident[]> {
  const params = zoneId != null ? `?zone_id=${zoneId}` : '';
  const r = await fetch(`${API}/tenants/${tenantId}/incidents${params}`);
  if (!r.ok) throw new Error('Failed to load incidents');
  const data = await r.json();
  return data.incidents;
}

export async function getTasks(tenantId: string, zoneId?: string | null): Promise<Task[]> {
  const params = zoneId != null ? `?zone_id=${zoneId}` : '';
  const r = await fetch(`${API}/tenants/${tenantId}/tasks${params}`);
  if (!r.ok) throw new Error('Failed to load tasks');
  const data = await r.json();
  return data.tasks;
}

export async function createIncident(body: {
  tenant_id: string;
  created_by_user_id: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  zone_id?: string | null;
}): Promise<Incident> {
  const r = await fetch(`${API}/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create incident');
  }
  return r.json();
}

// ---------- Incident categories ----------

export interface IncidentCategory {
  id: string;
  tenant_id: string;
  key: string;
  label: string;
  active: boolean;
  sort_order: number;
}

export async function getIncidentCategories(tenantId: string): Promise<IncidentCategory[]> {
  const r = await fetch(`${API}/tenants/${tenantId}/incident-categories`);
  if (!r.ok) throw new Error('Failed to load incident categories');
  return r.json();
}

export async function createIncidentCategory(
  tenantId: string,
  body: { key: string; label: string; active?: boolean; sort_order?: number },
): Promise<IncidentCategory> {
  const r = await fetch(`${API}/tenants/${tenantId}/incident-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create incident category');
  }
  return r.json();
}

export async function updateIncidentCategory(
  categoryId: string,
  body: Partial<Pick<IncidentCategory, 'label' | 'active' | 'sort_order'>>,
): Promise<IncidentCategory> {
  const r = await fetch(`${API}/incident-categories/${categoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update incident category');
  }
  return r.json();
}

export async function deleteIncidentCategory(categoryId: string): Promise<void> {
  const r = await fetch(`${API}/incident-categories/${categoryId}`, {
    method: 'DELETE',
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete incident category');
  }
}

export interface ZoneIncidentCategory extends IncidentCategory {
  visible_for_zone: boolean;
}

export async function getZoneIncidentCategories(zoneId: string): Promise<ZoneIncidentCategory[]> {
  const r = await fetch(`${API}/zones/${zoneId}/incident-categories`);
  if (!r.ok) throw new Error('Failed to load zone incident categories');
  return r.json();
}

export async function setZoneIncidentCategories(
  zoneId: string,
  configs: { incident_category_id: string; visible: boolean }[],
): Promise<void> {
  const r = await fetch(`${API}/zones/${zoneId}/incident-categories`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configs),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update zone incident categories');
  }
}

// ---------- Zone CRUD (for zone editor) ----------

export const ZONE_TYPES = [
  'primary_centre',
  'secondary_high_street',
  'night_economy',
  'transport_hub',
  'regeneration_corridor',
  'event',
  'other',
] as const;

export async function createZone(body: {
  tenant_id: string;
  name: string;
  description?: string | null;
  zone_type: string;
  geometry: { type: string; coordinates: unknown };
  status?: string;
}): Promise<Zone> {
  const r = await fetch(`${API}/zones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create zone');
  }
  return r.json();
}

export async function updateZone(
  zoneId: string,
  body: {
    name?: string;
    description?: string | null;
    zone_type?: string;
    geometry?: { type: string; coordinates: unknown };
    status?: string;
  }
): Promise<Zone> {
  const r = await fetch(`${API}/zones/${zoneId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update zone');
  }
  return r.json();
}

export async function getZone(zoneId: string): Promise<Zone> {
  const r = await fetch(`${API}/zones/${zoneId}`);
  if (!r.ok) throw new Error('Zone not found');
  return r.json();
}
