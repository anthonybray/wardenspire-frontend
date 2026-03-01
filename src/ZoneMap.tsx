// ########################################
// ############ Zone map (Leaflet + OSM) ##############
// ########################################

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Zone, Incident } from './api'

// GeoJSON Polygon for zone geometry (backend sends [ring][point][lng, lat])
interface GeoJsonPolygon {
  type: 'Polygon'
  coordinates: [number, number][][]
}

// Fix default marker icon in bundler (Vite) - Leaflet expects images at relative path
const icon = new L.Icon.Default({
  imagePath: 'https://unpkg.com/leaflet@1.9.4/dist/images/',
})
L.Marker.prototype.options.icon = icon

interface ZoneMapProps {
  zones: Zone[]
  incidents: Incident[]
  selectedZoneId: string | null
}

function boundsFromGeometry(geometry: Zone['geometry']): L.LatLngBounds | null {
  const g = geometry as GeoJsonPolygon | null | undefined
  if (!g || g.type !== 'Polygon' || !Array.isArray(g.coordinates) || !g.coordinates[0]) return null
  const ring = g.coordinates[0]
  if (!ring.length) return null
  const points = ring.map(([lng, lat]) => L.latLng(lat, lng))
  return L.latLngBounds(points)
}

function FitBounds({ zones, selectedZoneId }: { zones: Zone[]; selectedZoneId: string | null }) {
  const map = useMap()
  const bounds = useMemo(() => {
    const toFit = selectedZoneId
      ? zones.filter((z) => z.id === selectedZoneId)
      : zones
    const all: L.LatLngBounds[] = []
    for (const z of toFit) {
      const b = boundsFromGeometry(z.geometry)
      if (b) all.push(b)
    }
    if (all.length === 0) return null
    if (all.length === 1) return all[0]
    return all.reduce((acc, b) => acc.extend(b), all[0].clone())
  }, [zones, selectedZoneId])

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 })
    }
  }, [map, bounds])

  return null
}

export default function ZoneMap({ zones, incidents, selectedZoneId }: ZoneMapProps) {
  const zonesToShow = useMemo(() => {
    if (selectedZoneId) return zones.filter((z) => z.id === selectedZoneId)
    return zones
  }, [zones, selectedZoneId])

  const incidentsToShow = useMemo(() => {
    if (selectedZoneId) return incidents.filter((i) => i.zone_id === selectedZoneId)
    return incidents
  }, [incidents, selectedZoneId])

  const defaultCenter: [number, number] = [52.71, -2.75]
  const defaultZoom = 14

  return (
    <div
      style={{
        height: 360,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #3f3f46',
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds zones={zones} selectedZoneId={selectedZoneId} />
        {zonesToShow.map((zone) => (
          <GeoJSON
            key={zone.id}
            data={zone.geometry as GeoJsonPolygon}
            style={{
              color: selectedZoneId ? '#6366f1' : '#71717a',
              weight: selectedZoneId ? 2.5 : 1.5,
              fillColor: '#6366f1',
              fillOpacity: selectedZoneId ? 0.15 : 0.08,
            }}
          />
        ))}
        {incidentsToShow.map((inc) => (
          <Marker key={inc.id} position={[inc.lat, inc.lng]} icon={icon}>
            <Popup>
              <strong>{inc.category}</strong>
              <br />
              {inc.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
