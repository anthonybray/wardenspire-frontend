// ########################################
// ############ Zone management (list, create, edit, archive) ##############
// ########################################

import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import {
  getZones,
  createZone,
  updateZone,
  getZone,
  ZONE_TYPES,
  type Zone,
  type Tenant,
} from './api'
import PolygonDrawMap, { type GeoJsonPolygon } from './PolygonDrawMap'
import { getShapeFromSearch, setShapeInUrl } from './urlShape'

const ZONE_TYPE_LABELS: Record<string, string> = {
  primary_centre: 'Primary town centre',
  secondary_high_street: 'Secondary high street',
  night_economy: 'Night-time economy',
  transport_hub: 'Transport hub',
  regeneration_corridor: 'Regeneration corridor',
  event: 'Event',
  other: 'Other',
}

interface ZoneManagementProps {
  tenant: Tenant
  onZonesChange?: () => void
}

type View = 'list' | 'add' | 'edit'
type EditState = { zone: Zone } | null

export default function ZoneManagement({ tenant, onZonesChange }: ZoneManagementProps) {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('list')
  const [editState, setEditState] = useState<EditState>(null)

  // Create form state
  const [newGeometry, setNewGeometry] = useState<GeoJsonPolygon | null>(null)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('primary_centre')
  const [newDescription, setNewDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Edit form state (when editing, we keep geometry in editGeometry; form has name, type, desc)
  const [editGeometry, setEditGeometry] = useState<GeoJsonPolygon | null>(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('primary_centre')
  const [editDescription, setEditDescription] = useState('')
  const [editingBoundary, setEditingBoundary] = useState(false)

  async function loadZones() {
    try {
      const list = await getZones(tenant.id)
      setZones(list)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load zones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadZones()
  }, [tenant.id])

  function openAdd() {
    setView('add')
    const fromUrl = getShapeFromSearch()
    setNewGeometry(fromUrl ?? null)
    setNewName('')
    setNewType('primary_centre')
    setNewDescription('')
    setSaveError(null)
  }

  function openEdit(zone: Zone) {
    setEditState({ zone })
    setView('edit')
    setEditGeometry(zone.geometry as GeoJsonPolygon)
    setEditName(zone.name)
    setEditType(zone.zone_type)
    setEditDescription(zone.description ?? '')
    setEditingBoundary(false)
    setSaveError(null)
  }

  function closeForm() {
    setView('list')
    setEditState(null)
    setNewGeometry(null)
    setEditGeometry(null)
    setEditingBoundary(false)
    onZonesChange?.()
  }

  async function handleCreate() {
    if (!newGeometry) {
      setSaveError('Draw and close the zone boundary first.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await createZone({
        tenant_id: tenant.id,
        name: newName.trim() || 'Unnamed zone',
        description: newDescription.trim() || null,
        zone_type: newType,
        geometry: newGeometry,
        status: 'active',
      })
      loadZones()
      closeForm()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to create zone')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate() {
    if (!editState) return
    setSaving(true)
    setSaveError(null)
    try {
      await updateZone(editState.zone.id, {
        name: editName.trim() || editState.zone.name,
        description: editDescription.trim() || null,
        zone_type: editType,
        geometry: editGeometry ?? undefined,
      })
      loadZones()
      closeForm()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to update zone')
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(zone: Zone) {
    if (!confirm(`Archive zone "${zone.name}"? It will no longer appear in the dashboard selector.`)) return
    try {
      await updateZone(zone.id, { status: 'archived' })
      loadZones()
      onZonesChange?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to archive zone')
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Loading zones…</div>
  if (error) return <div style={{ padding: 24, color: '#ef4444' }}>{error}</div>

  if (view === 'add') {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Add zone</h2>
        <PolygonDrawMap
          onComplete={setNewGeometry}
          initialGeometry={null}
          initialPendingGeometry={newGeometry ?? undefined}
          height={320}
          onShapeClosed={(g) => setShapeInUrl(g)}
          onClear={() => {
            setShapeInUrl(null)
            setNewGeometry(null)
          }}
        />
        {newGeometry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, marginTop: 16 }}>
            <label>
              <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa' }}>Name</span>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Primary Town Centre"
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 6,
                  background: '#18181b',
                  color: '#e4e4e7',
                  border: '1px solid #3f3f46',
                }}
              />
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa' }}>Zone type</span>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 6,
                  background: '#18181b',
                  color: '#e4e4e7',
                  border: '1px solid #3f3f46',
                }}
              >
                {ZONE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ZONE_TYPE_LABELS[t] ?? t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa' }}>Description (optional)</span>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 6,
                  background: '#18181b',
                  color: '#e4e4e7',
                  border: '1px solid #3f3f46',
                }}
              />
            </label>
            {saveError && <div style={{ color: '#ef4444', fontSize: 14 }}>{saveError}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                size="small"
                disabled={saving}
                onClick={handleCreate}
              >
                {saving ? 'Saving…' : 'Save zone'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={closeForm}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view === 'edit' && editState) {
    const zone = editState.zone
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Edit zone: {zone.name}</h2>
        {editingBoundary ? (
          <PolygonDrawMap
            onComplete={(g) => {
              setEditGeometry(g)
              setEditingBoundary(false)
            }}
            initialGeometry={null}
            height={320}
          />
        ) : (
          <PolygonDrawMap
            initialGeometry={editGeometry ?? undefined}
            readOnly
            height={280}
          />
        )}
        <div style={{ marginTop: 16 }}>
          {!editingBoundary && (
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={() => setEditingBoundary(true)}
              sx={{ mb: 2 }}
            >
              Replace boundary
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
          <label>
            <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa' }}>Name</span>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                background: '#18181b',
                color: '#e4e4e7',
                border: '1px solid #3f3f46',
              }}
            />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa' }}>Zone type</span>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                background: '#18181b',
                color: '#e4e4e7',
                border: '1px solid #3f3f46',
              }}
            >
              {ZONE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ZONE_TYPE_LABELS[t] ?? t}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: 4, color: '#a1a1aa' }}>Description (optional)</span>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 6,
                background: '#18181b',
                color: '#e4e4e7',
                border: '1px solid #3f3f46',
              }}
            />
          </label>
          {saveError && <div style={{ color: '#ef4444', fontSize: 14 }}>{saveError}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              size="small"
              disabled={saving}
              onClick={handleUpdate}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={closeForm}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>Zone management</h2>
      <p style={{ color: '#a1a1aa', marginBottom: 16 }}>Create, edit, or archive zones for {tenant.name}.</p>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        size="small"
        onClick={openAdd}
        sx={{ mb: 3 }}
      >
        Add zone
      </Button>
      <div style={{ border: '1px solid #3f3f46', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#18181b', borderBottom: '1px solid #3f3f46' }}>
              <th style={{ padding: 12, textAlign: 'left', color: '#a1a1aa', fontWeight: 500 }}>Name</th>
              <th style={{ padding: 12, textAlign: 'left', color: '#a1a1aa', fontWeight: 500 }}>Type</th>
              <th style={{ padding: 12, textAlign: 'left', color: '#a1a1aa', fontWeight: 500 }}>Status</th>
              <th style={{ padding: 12, textAlign: 'right', color: '#a1a1aa', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: 12, color: '#e4e4e7' }}>{z.name}</td>
                <td style={{ padding: 12, color: '#a1a1aa' }}>{ZONE_TYPE_LABELS[z.zone_type] ?? z.zone_type}</td>
                <td style={{ padding: 12, color: z.status === 'archived' ? '#71717a' : '#22c55e' }}>{z.status}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => openEdit(z)}
                    style={{
                      marginRight: 8,
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid #3f3f46',
                      background: 'transparent',
                      color: '#e4e4e7',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  {z.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleArchive(z)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: '1px solid #3f3f46',
                        background: 'transparent',
                        color: '#71717a',
                        cursor: 'pointer',
                      }}
                    >
                      Archive
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {zones.length === 0 && (
          <div style={{ padding: 24, color: '#71717a', textAlign: 'center' }}>No zones yet. Add one above.</div>
        )}
      </div>
    </div>
  )
}
