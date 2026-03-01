// ########################################
// ############ App: zone selector, map, lists, report ##############
// ########################################

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  getTenantBySlug,
  getZones,
  getIncidents,
  getTasks,
  type Tenant,
  type Zone,
  type Incident,
  type Task,
} from './api'
import ZoneSelector from './ZoneSelector'
import ZoneMap from './ZoneMap'
import IncidentList from './IncidentList'
import TaskList from './TaskList'
import ReportForm from './ReportForm'
import ZoneManagement from './ZoneManagement'
import Admin from './Admin'

const DEFAULT_TENANT_SLUG = 'shrewsbury-bid'

type Tab = 'dashboard' | 'zones' | 'report' | 'admin'

export default function App() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [zones, setZones] = useState<Zone[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadTenantAndZones() {
    try {
      const t = await getTenantBySlug(DEFAULT_TENANT_SLUG)
      setTenant(t)
      const zList = await getZones(t.id)
      setZones(zList)
      setSelectedZoneId(t.default_zone_id ?? (zList[0]?.id ?? null))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tenant')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenantAndZones()
  }, [])

  async function loadIncidentsAndTasks() {
    if (!tenant) return
    try {
      const [inc, tsk] = await Promise.all([
        getIncidents(tenant.id, selectedZoneId),
        getTasks(tenant.id, selectedZoneId),
      ])
      setIncidents(inc)
      setTasks(tsk)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    }
  }

  useEffect(() => {
    if (tenant) loadIncidentsAndTasks()
  }, [tenant?.id, selectedZoneId])

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  if (error && !tenant) return <div style={{ padding: 24, color: '#ef4444' }}>{error}</div>
  if (!tenant) return null

  const activeZones = zones.filter((z) => z.status === 'active')

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Wardenspire
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {tenant.name}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mb: 3,
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          variant={tab === 'dashboard' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setTab('dashboard')}
        >
          Dashboard
        </Button>
        <Button
          variant={tab === 'zones' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setTab('zones')}
        >
          Zones
        </Button>
        <Button
          variant={tab === 'report' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setTab('report')}
        >
          Report incident
        </Button>
        <Button
          variant={tab === 'admin' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setTab('admin')}
        >
          Admin
        </Button>
      </Box>

      {tab === 'zones' && <ZoneManagement tenant={tenant} onZonesChange={loadTenantAndZones} />}

      {tab === 'dashboard' && (
        <>
          <ZoneSelector zones={activeZones} selectedZoneId={selectedZoneId} onSelect={setSelectedZoneId} />

          <Box sx={{ mb: 3 }}>
            <ZoneMap zones={activeZones} incidents={incidents} selectedZoneId={selectedZoneId} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <IncidentList incidents={incidents} />
            <TaskList tasks={tasks} />
          </Box>
        </>
      )}

      {tab === 'report' && (
        <ReportForm tenantId={tenant.id} zones={activeZones} onCreated={loadIncidentsAndTasks} />
      )}

      {tab === 'admin' && (
        <Admin tenant={tenant} zones={activeZones} />
      )}
    </Box>
  )
}
