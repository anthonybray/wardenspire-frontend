// ########################################
// ############ URL shape encode/decode (shareable zone boundary) ##############
// ########################################

import type { GeoJsonPolygon } from './PolygonDrawMap'

const PARAM = 'shape'

/**
 * Encode a polygon's first ring to a URL-safe string (base64url of JSON).
 */
export function encodeShapeToUrl(geometry: GeoJsonPolygon): string {
  const ring = geometry.coordinates[0]
  if (!ring?.length) return ''
  const json = JSON.stringify(ring)
  const base64 = typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(json))) : ''
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Decode a URL param value back to GeoJSON Polygon, or null if invalid.
 */
export function decodeShapeFromUrl(encoded: string): GeoJsonPolygon | null {
  if (!encoded || typeof encoded !== 'string') return null
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(typeof atob !== 'undefined' ? atob(base64) : ''))
    const ring = JSON.parse(json) as [number, number][]
    if (!Array.isArray(ring) || ring.length < 3) return null
    const closed = ring.map(([lng, lat]) => [lng, lat] as [number, number])
    if (closed[0][0] !== closed[closed.length - 1][0] || closed[0][1] !== closed[closed.length - 1][1]) {
      closed.push([closed[0][0], closed[0][1]])
    }
    return { type: 'Polygon', coordinates: [closed] }
  } catch {
    return null
  }
}

/**
 * Read shape from current window location search (e.g. ?shape=...).
 */
export function getShapeFromSearch(search?: string): GeoJsonPolygon | null {
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '')
  const params = new URLSearchParams(s)
  const value = params.get(PARAM)
  return value ? decodeShapeFromUrl(value) : null
}

/**
 * Update the browser URL to include shape=... without a full navigation.
 */
export function setShapeInUrl(geometry: GeoJsonPolygon | null): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (geometry) {
    url.searchParams.set(PARAM, encodeShapeToUrl(geometry))
  } else {
    url.searchParams.delete(PARAM)
  }
  window.history.replaceState(null, '', url.toString())
}
