// ########################################
// ############ Task list (zone-filtered) ##############
// ########################################

import type { Task } from './api'

interface Props {
  tasks: Task[]
}

export default function TaskList({ tasks }: Props) {
  return (
    <section>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Tasks</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.length === 0 && <li style={{ color: '#71717a' }}>No tasks</li>}
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              padding: 12,
              marginBottom: 8,
              background: '#18181b',
              borderRadius: 8,
              borderLeft: '3px solid #22c55e',
            }}
          >
            <div style={{ fontWeight: 600 }}>{t.status} · {t.priority}</div>
            <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>
              {t.zone_id ? `Zone: ${t.zone_id.slice(0, 8)}…` : '—'} · {t.incident_ids.length} incident(s)
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
