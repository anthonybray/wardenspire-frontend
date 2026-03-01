// ########################################
// ############ Report incident (PWA: GPS → zone, or pick on map) ##############
// ########################################

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import L from 'leaflet'
import {
  createIncident,
  resolveZone,
  getZoneIncidentCategories,
  type Zone,
  type ZoneIncidentCategory,
} from './api'

interface GeoJsonPolygon {
  type: 'Polygon'
  coordinates: [number, number][][]
}

interface Props {
  tenantId: string
  zones: Zone[]
  onCreated: () => void
}

type Mode = 'gps' | 'manual'

function boundsFromGeometry(geometry: Zone['geometry']): L.LatLngBounds | null {
  const g = geometry as GeoJsonPolygon | null | undefined
  if (!g || g.type !== 'Polygon' || !Array.isArray(g.coordinates) || !g.coordinates[0]) return null
  const ring = g.coordinates[0]
  if (!ring.length) return null
  const points = ring.map(([lng, lat]) => L.latLng(lat, lng))
  return L.latLngBounds(points)
}

function LocationClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function SelectLocationMap({
  zones,
  selected,
  onSelect,
}: {
  zones: Zone[]
  selected: { lat: number; lng: number } | null
  onSelect: (lat: number, lng: number) => void
}) {
  const defaultCenter: [number, number] = [52.71, -2.75]
  const defaultZoom = 14

  const allBounds: L.LatLngBounds[] = []
  zones.forEach((z) => {
    const b = boundsFromGeometry(z.geometry)
    if (b) allBounds.push(b)
  })

  // Fix default marker icon in bundler (Vite) - Leaflet expects images at relative path
  const icon = new L.Icon.Default({
    imagePath: 'https://unpkg.com/leaflet@1.9.4/dist/images/',
  })

  return (
    <div
      style={{
        height: 260,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #3f3f46',
        marginBottom: 12,
      }}
    >
      <MapContainer
        center={selected ? [selected.lat, selected.lng] : defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        whenCreated={(map) => {
          if (allBounds.length) {
            const combined =
              allBounds.length === 1
                ? allBounds[0]
                : allBounds.reduce((acc, b) => acc.extend(b), allBounds[0].clone())
            map.fitBounds(combined, { padding: [24, 24], maxZoom: 16 })
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => (
          <GeoJSON
            // eslint-disable-next-line react/no-array-index-key
            key={zone.id}
            data={zone.geometry as GeoJsonPolygon}
            style={{
              color: '#6366f1',
              weight: 2,
              fillColor: '#6366f1',
              fillOpacity: 0.08,
            }}
          />
        ))}
        {selected && <Marker position={[selected.lat, selected.lng]} icon={icon} />}
        <LocationClickHandler onSelect={onSelect} />
      </MapContainer>
    </div>
  )
}

export default function ReportForm({ tenantId, zones, onCreated }: Props) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'getting-location' | 'submitting' | 'done' | 'error'>('idle')
  const [resolvedZoneName, setResolvedZoneName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('gps')
  const [manualLocation, setManualLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedZoneId, setSelectedZoneId] = useState<string>('') // must choose explicitly
  const [categories, setCategories] = useState<ZoneIncidentCategory[]>([])

  useEffect(() => {
    if (!selectedZoneId) {
      setCategories([])
      return
    }
    async function loadCategoriesForZone() {
      try {
        const list = await getZoneIncidentCategories(selectedZoneId)
        const visible = list.filter((c) => c.visible_for_zone && c.active)
        setCategories(visible)
        if (visible.length && !category) {
          setCategory(visible[0].key)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load zone incident categories', err)
      }
    }
    loadCategoriesForZone()
  }, [selectedZoneId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!selectedZoneId) {
      setError('Choose a zone first.')
      setStatus('error')
      return
    }
    if (!category) {
      setError('Choose a category.')
      setStatus('error')
      return
    }
    let lat: number
    let lng: number

    if (mode === 'gps') {
      setStatus('getting-location')
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
        })
        lat = pos.coords.latitude
        lng = pos.coords.longitude
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not get location. You can also choose a point on the map.')
        setStatus('error')
        return
      }
    } else {
      if (!manualLocation) {
        setError('Click on the map to choose where the incident happened.')
        setStatus('error')
        return
      }
      lat = manualLocation.lat
      lng = manualLocation.lng
      setStatus('submitting')
    }

    const res = await resolveZone(tenantId, lat, lng, true)
    const zoneName = res.zone_id ? zones.find((z) => z.id === res.zone_id)?.name ?? null : null
    setResolvedZoneName(zoneName ?? (res.unassigned ? 'Out of zone' : null))
    setStatus('submitting')

    try {
      await createIncident({
        tenant_id: tenantId,
        created_by_user_id: 'pwa-user',
        category,
        description,
        lat,
        lng,
      })
      setStatus('done')
      setDescription('')
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident')
      setStatus('error')
    }
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Report incident
      </Typography>
      <Box sx={{ maxWidth: 400, mb: 2 }}>
        <TextField
          select
          label="Zone"
          value={selectedZoneId}
          onChange={(e) => {
            setSelectedZoneId(e.target.value)
            setError(null)
            setStatus('idle')
          }}
        >
          <MenuItem value="">Select a zone…</MenuItem>
          {zones.map((z) => (
            <MenuItem key={z.id} value={z.id}>
              {z.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {selectedZoneId && (
        <>
          <ToggleButtonGroup
            color="primary"
            exclusive
            size="small"
            value={mode}
            onChange={(_, value: Mode | null) => {
              if (!value) return
              setMode(value)
              setStatus('idle')
              setError(null)
            }}
            sx={{ mb: 1.5, flexWrap: 'wrap' }}
          >
            <ToggleButton value="gps">Use my location (GPS)</ToggleButton>
            <ToggleButton value="manual">Choose on map</ToggleButton>
          </ToggleButtonGroup>

          {mode === 'manual' && (
            <SelectLocationMap
              zones={zones.filter((z) => z.id === selectedZoneId)}
              selected={manualLocation}
              onSelect={(lat, lng) => {
                setManualLocation({ lat, lng })
                setError(null)
                setStatus('idle')
              }}
            />
          )}
        </>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mt: selectedZoneId ? 1 : 0 }}
      >
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categories.length === 0}
          helperText={categories.length === 0 ? 'No categories configured for this tenant.' : undefined}
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.key}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          multiline
          minRows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {resolvedZoneName && status !== 'idle' && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Zone (resolved): {resolvedZoneName}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={status === 'getting-location' || status === 'submitting'}
        >
          {status === 'getting-location' && 'Getting location…'}
          {status === 'submitting' && 'Submitting…'}
          {status === 'done' && 'Reported'}
          {status === 'error' && 'Try again'}
          {status === 'idle' && (mode === 'gps' ? 'Report (use my location)' : 'Report incident')}
        </Button>
      </Box>
    </Box>
  )
}
