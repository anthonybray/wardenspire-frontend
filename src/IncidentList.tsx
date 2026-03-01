// ########################################
// ############ Incident list (zone-filtered) ##############
// ########################################

import type { Incident } from './api'

interface Props {
  incidents: Incident[]
}

export default function IncidentList({ incidents }: Props) {
  return (
    <section>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Incidents</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {incidents.length === 0 && <li style={{ color: '#71717a' }}>No incidents</li>}
        {incidents.map((i) => (
          <li
            key={i.id}
            style={{
              padding: 12,
              marginBottom: 8,
              background: '#18181b',
              borderRadius: 8,
              borderLeft: '3px solid #6366f1',
            }}
          >
            <div style={{ fontWeight: 600 }}>{i.category}</div>
            <div style={{ color: '#a1a1aa', fontSize: 14 }}>{i.description}</div>
            <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>
              {i.zone_id ? `Zone: ${i.zone_id.slice(0, 8)}…` : 'Out of zone'} · {i.status}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
