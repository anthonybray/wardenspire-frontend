// ########################################
// ############ Polygon draw map (click to add vertices) ##############
// ########################################

import { useCallback, useRef, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

export interface GeoJsonPolygon {
  type: 'Polygon'
  coordinates: [number, number][][]
}

interface PolygonDrawMapProps {
  /** When user closes the shape, at least 3 points. Coordinates [lng, lat] per ring. */
  onComplete?: (geometry: GeoJsonPolygon) => void
  /** Optional initial geometry to display (e.g. when editing). If set, initial points are loaded for re-drawing. */
  initialGeometry?: GeoJsonPolygon | null
  /** If set, start with this shape closed and pending (e.g. from URL); user can confirm or clear. */
  initialPendingGeometry?: GeoJsonPolygon | null
  /** If true, only show the polygon; no click to add or Close shape. */
  readOnly?: boolean
  height?: number
  /** Called when user closes the shape (snap or button); optional e.g. for URL sync. */
  onShapeClosed?: (geometry: GeoJsonPolygon) => void
  /** Called when user clears the drawn shape (e.g. to clear URL). */
  onClear?: () => void
}

const SNAP_PIXELS = 20

function DrawHandler({
  points,
  closed,
  readOnly,
  onAddPoint,
  onCloseShape,
  setMousePosition,
  setSnapToClose,
}: {
  points: [number, number][]
  closed: boolean
  readOnly: boolean
  onAddPoint: (lat: number, lng: number) => void
  onCloseShape: () => void
  setMousePosition: (v: [number, number] | null) => void
  setSnapToClose: (v: boolean) => void
}) {
  const map = useMap()
  useMapEvents({
    mousemove(e) {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      setMousePosition([lat, lng])
      if (readOnly || closed || points.length < 3) {
        setSnapToClose(false)
        return
      }
      const first = points[0]
      const pt0 = map.latLngToContainerPoint(L.latLng(first[0], first[1]))
      const dist = Math.hypot(e.containerPoint.x - pt0.x, e.containerPoint.y - pt0.y)
      setSnapToClose(dist < SNAP_PIXELS)
    },
    mouseout() {
      setMousePosition(null)
      setSnapToClose(false)
    },
    click(e) {
      if (closed || readOnly) return
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      if (points.length >= 3) {
        const first = points[0]
        const pt0 = map.latLngToContainerPoint(L.latLng(first[0], first[1]))
        const dist = Math.hypot(e.containerPoint.x - pt0.x, e.containerPoint.y - pt0.y)
        if (dist < SNAP_PIXELS) {
          onCloseShape()
          return
        }
      }
      onAddPoint(lat, lng)
    },
  })
  return null
}

export default function PolygonDrawMap({
  onComplete,
  initialGeometry,
  initialPendingGeometry = null,
  readOnly = false,
  height = 360,
  onShapeClosed,
  onClear,
}: PolygonDrawMapProps) {
  const [points, setPoints] = useState<[number, number][]>(() => {
    const from = initialPendingGeometry ?? initialGeometry
    if (from?.coordinates?.[0]?.length) {
      const ring = from.coordinates[0]
      const pts = ring.map(([lng, lat]) => [lat, lng] as [number, number])
      if (pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) {
        pts.pop()
      }
      return pts
    }
    return []
  })
  const [closed, setClosed] = useState(!!initialPendingGeometry)
  const [pendingGeometry, setPendingGeometry] = useState<GeoJsonPolygon | null>(initialPendingGeometry ?? null)
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(null)
  const [snapToClose, setSnapToClose] = useState(false)
  const closedRef = useRef(!!initialPendingGeometry)

  const handleAddPoint = useCallback((lat: number, lng: number) => {
    if (closedRef.current || readOnly) return
    setPoints((prev) => [...prev, [lat, lng]])
  }, [readOnly])

  const handleUndo = useCallback(() => {
    if (closedRef.current || readOnly) return
    setPoints((prev) => (prev.length ? prev.slice(0, -1) : prev))
  }, [readOnly])

  const handleClear = useCallback(() => {
    if (readOnly) return
    setPoints([])
    setClosed(false)
    setPendingGeometry(null)
    closedRef.current = false
    onClear?.()
  }, [readOnly, onClear])

  const handleCloseShape = useCallback(() => {
    if (points.length < 3 || readOnly) return
    const ring: [number, number][] = points.map(([lat, lng]) => [lng, lat])
    ring.push(ring[0])
    const geometry: GeoJsonPolygon = { type: 'Polygon', coordinates: [ring] }
    closedRef.current = true
    setClosed(true)
    setPendingGeometry(geometry)
    onShapeClosed?.(geometry)
  }, [points, readOnly, onShapeClosed])

  const handleConfirmShape = useCallback(() => {
    if (pendingGeometry && onComplete) {
      onComplete(pendingGeometry)
    }
  }, [pendingGeometry, onComplete])

  const latLngs = points.length >= 2 ? points.map(([lat, lng]) => L.latLng(lat, lng)) : []
  const polygonLatLngs =
    points.length >= 3 ? [...points.map(([lat, lng]) => L.latLng(lat, lng)), L.latLng(points[0][0], points[0][1])] : []

  const showPolygon = readOnly && initialGeometry?.coordinates?.[0]?.length
  const readOnlyRing = showPolygon
    ? (initialGeometry!.coordinates[0] as [number, number][]).map(([lng, lat]) => L.latLng(lat, lng))
    : []

  return (
    <div style={{ marginBottom: 16 }}>
      {!readOnly && (
        <>
          <p style={{ fontSize: 14, color: '#a1a1aa', marginBottom: 8 }}>
            Draw the zone point by point: click the map to place each corner (the zone fills as you go). Close the shape with &quot;Close shape&quot; or by moving back to the first point and clicking.
            {snapToClose && (
              <span style={{ display: 'block', marginTop: 4, color: '#22c55e', fontWeight: 500 }}>
                Click to close the shape
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {!pendingGeometry ? (
              <>
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={points.length === 0}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #3f3f46',
                    background: '#27272a',
                    color: '#e4e4e7',
                    cursor: points.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Undo last point
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={points.length === 0}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #3f3f46',
                    background: '#27272a',
                    color: '#e4e4e7',
                    cursor: points.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCloseShape}
                  disabled={points.length < 3}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #6366f1',
                    background: points.length < 3 ? '#27272a' : '#6366f1',
                    color: '#e4e4e7',
                    cursor: points.length < 3 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Close shape {points.length >= 3 ? `(${points.length} points)` : '(need 3+ points)'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    width: 40,
                    height: 40,
                    padding: 0,
                    borderRadius: '50%',
                    border: '2px solid #ef4444',
                    background: '#fff',
                    color: '#ef4444',
                    fontSize: 20,
                    lineHeight: 1,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Delete zone and redraw"
                >
                  ×
                </button>
                <span style={{ color: '#a1a1aa', fontSize: 14 }}>Delete zone and redraw</span>
                <button
                  type="button"
                  onClick={handleConfirmShape}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#22c55e',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Use this zone
                </button>
              </>
            )}
          </div>
        </>
      )}
      <div style={{ height, borderRadius: 8, overflow: 'hidden', border: '1px solid #3f3f46' }}>
        <MapContainer
          center={[52.71, -2.75]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {!readOnly && (
            <DrawHandler
              points={points}
              closed={closed}
              readOnly={readOnly}
              onAddPoint={handleAddPoint}
              onCloseShape={handleCloseShape}
              setMousePosition={setMousePosition}
              setSnapToClose={setSnapToClose}
            />
          )}
          {!readOnly && points.length >= 2 && !closed && mousePosition && (
            <Polyline
              positions={[
                L.latLng(points[points.length - 1][0], points[points.length - 1][1]),
                L.latLng(mousePosition[0], mousePosition[1]),
              ]}
              pathOptions={{ color: '#6366f1', weight: 2, dashArray: '6,6', opacity: 0.8 }}
            />
          )}
          {readOnly && readOnlyRing.length >= 3 && (
            <Polygon
              positions={readOnlyRing}
              pathOptions={{ color: '#6366f1', weight: 2, fillColor: '#6366f1', fillOpacity: 0.25 }}
            />
          )}
          {!readOnly && polygonLatLngs.length >= 4 && !pendingGeometry && (
            <Polygon
              positions={polygonLatLngs}
              pathOptions={{ color: '#6366f1', weight: 2.5, fillColor: '#6366f1', fillOpacity: 0.3 }}
            />
          )}
          {!readOnly && pendingGeometry && pendingGeometry.coordinates[0]?.length >= 3 && (
            <Polygon
              positions={(pendingGeometry.coordinates[0] as [number, number][]).map(([lng, lat]) => L.latLng(lat, lng))}
              pathOptions={{ color: '#6366f1', weight: 2.5, fillColor: '#6366f1', fillOpacity: 0.35 }}
            />
          )}
          {!readOnly && latLngs.length >= 2 && latLngs.length < 3 && (
            <Polygon
              positions={latLngs}
              pathOptions={{ color: '#6366f1', weight: 2, dashArray: '8,6', fill: false }}
            />
          )}
          {!readOnly &&
            points.map(([lat, lng], i) => (
              <CircleMarker
                key={`${lat}-${lng}-${i}`}
                center={[lat, lng]}
                radius={i === 0 ? 8 : 6}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: i === 0 ? '#22c55e' : '#6366f1',
                  fillOpacity: 1,
                }}
              />
            ))}
        </MapContainer>
      </div>
    </div>
  )
}
