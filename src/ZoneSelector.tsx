// ########################################
// ############ Zone selector ##############
// ########################################

import type { Zone } from './api'

interface Props {
  zones: Zone[]
  selectedZoneId: string | null
  onSelect: (zoneId: string | null) => void
}

export default function ZoneSelector({ zones, selectedZoneId, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 8 }}>
      <span style={{ marginRight: 4, color: '#a1a1aa' }}>Zone:</span>
      <select
        value={selectedZoneId ?? ''}
        onChange={(e) => onSelect(e.target.value || null)}
        style={{
          minWidth: 220,
          padding: 8,
          borderRadius: 6,
          background: '#18181b',
          color: '#e4e4e7',
          border: '1px solid #3f3f46',
        }}
      >
        {zones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>
    </div>
  )
}
