// ########################################
// ############ Admin: incident categories & zone visibility ##############
// ########################################
//
// Admin tab for tenant configuration:
// - Incident categories: add categories (label only; key auto-generated), list as tiles, open modal to edit label.
// - Categories by zone: per-zone checkboxes to show/hide categories; Save visibility persists to API.

// ########################################
// ############ Imports ##############
// ########################################

import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import type { Tenant, Zone, IncidentCategory, ZoneIncidentCategory } from './api'
import {
  getIncidentCategories,
  getZoneIncidentCategories,
  setZoneIncidentCategories,
  createIncidentCategory,
  updateIncidentCategory,
  deleteIncidentCategory,
} from './api'

// ########################################
// ############ Types ##############
// ########################################

interface AdminProps {
  tenant: Tenant
  zones: Zone[]
}

/** Which sub-tab is active: tenant-wide categories or per-zone visibility */
type AdminSection = 'categories' | 'zone-categories'

// ########################################
// ############ Component ##############
// ########################################

export default function Admin({ tenant, zones }: AdminProps) {
  // ---------- Section tab & tenant categories list ----------
  const [section, setSection] = useState<AdminSection>('categories')
  const [categories, setCategories] = useState<IncidentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------- Add-category form (Incident categories tab) ----------
  const [newLabel, setNewLabel] = useState('')
  const [savingNew, setSavingNew] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)

  // ---------- Categories by zone: selected zone & its visibility list ----------
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id ?? '')
  const [zoneCategories, setZoneCategories] = useState<ZoneIncidentCategory[]>([])
  const [zoneSaving, setZoneSaving] = useState(false)

  // ---------- Edit category modal (opened when clicking a category tile) ----------
  const [editingCategory, setEditingCategory] = useState<IncidentCategory | null>(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [deleteConfirmCategory, setDeleteConfirmCategory] =
    useState<IncidentCategory | null>(null)

  // Load tenant incident categories on mount / tenant change
  useEffect(() => {
    async function load() {
      try {
        const list = await getIncidentCategories(tenant.id)
        setCategories(list)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load incident categories')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tenant.id])

  // Load effective categories for selected zone (Categories by zone tab)
  useEffect(() => {
    if (!selectedZoneId) return
    async function loadZoneCats() {
      try {
        const list = await getZoneIncidentCategories(selectedZoneId)
        setZoneCategories(list)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load zone categories')
      }
    }
    loadZoneCats()
  }, [selectedZoneId])

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === selectedZoneId) ?? null,
    [zones, selectedZoneId],
  )

  /** Slug from label for new category; ensures uniqueness by appending _2, _3, … if needed */
  function generateKeyFromLabel(label: string): string {
    const base = label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
    if (!base) {
      return `category_${categories.length + 1}`
    }
    let candidate = base
    let suffix = 1
    const existingKeys = new Set(categories.map((c) => c.key))
    while (existingKeys.has(candidate)) {
      suffix += 1
      candidate = `${base}_${suffix}`
    }
    return candidate
  }

  /** Categories to show in the list (currently all; could filter inactive later) */
  const visibleCategories = useMemo(() => categories, [categories])

  if (loading) {
    return <Box sx={{ mt: 2 }}>Loading admin…</Box>
  }

  // Fatal error: show message only (e.g. tenant/zone load failed)
  if (error) {
    return (
      <Box sx={{ mt: 2, color: 'error.main' }}>
        {error}
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* ---------- Page title ---------- */}
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Admin
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Tenant configuration for {tenant.name}.
      </Typography>

      {/* ---------- Section tabs: Incident categories | Categories by zone ---------- */}
      <ToggleButtonGroup
        color="primary"
        exclusive
        size="small"
        value={section}
        onChange={(_, value: AdminSection | null) => {
          if (!value) return
          setSection(value)
        }}
        sx={{ mb: 2, flexWrap: 'wrap' }}
      >
        <ToggleButton value="categories">Incident categories</ToggleButton>
        <ToggleButton value="zone-categories">Categories by zone</ToggleButton>
      </ToggleButtonGroup>

      {/* ---------- Incident categories panel ---------- */}
      {section === 'categories' && (
        <Paper
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(62,45,96,0.6)',
            backgroundColor: '#272932',
          }}
        >
          {/* Panel header: gear icon + title + info tooltip */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.25,
              bgcolor: '#1e2026',
              borderBottom: '1px solid #3e2d60',
            }}
          >
            <Typography component="span" sx={{ fontSize: 25, color: '#37ebf3' }}>
              ⚙
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 550, mr: 'auto' }}>
              Tenant incident categories
            </Typography>
            <Tooltip title="These categories are available to all zones by default. You can limit them per zone in &quot;Categories by zone&quot;.">
              <IconButton
                size="small"
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: '#efefef',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.8)',
                  },
                }}
              >
                <Typography component="span" sx={{ fontSize: 14, lineHeight: 1 }}>
                  i
                </Typography>
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ p: 2 }}>
            {/* Add new category: label input + Add category button */}
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2">Add a new category</Typography>
            <Tooltip title="Enter a human-readable label shown to reporters. A stable internal identifier will be generated automatically.">
              <IconButton
                size="small"
                sx={{
                  ml: 0.5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: '#efefef',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.8)',
                  },
                }}
              >
                <Typography component="span" sx={{ fontSize: 14, lineHeight: 1 }}>
                  i
                </Typography>
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'flex-end' }}
            sx={{ mb: 2 }}
          >
            <TextField
              label="Category"
              size="small"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Environmental"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180, maxWidth: 320, flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={savingNew || !newLabel}
              sx={{ whiteSpace: 'nowrap', flexShrink: 0, height: 40 }}
              onClick={async () => {
                if (!newLabel) return
                setSavingNew(true)
                try {
                  const generatedKey = generateKeyFromLabel(newLabel)
                  const created = await createIncidentCategory(tenant.id, {
                    key: generatedKey,
                    label: newLabel,
                    sort_order: 0,
                    active: true,
                  })
                  setCategories((prev) =>
                    [...prev, created].sort((a, b) => a.label.localeCompare(b.label)),
                  )
                  setNewLabel('')
                  setError(null)
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error(e)
                  setError(
                    e instanceof Error ? e.message : 'Failed to create incident category',
                  )
                } finally {
                  setSavingNew(false)
                }
              }}
            >
              {savingNew ? 'Adding…' : 'Add category'}
            </Button>
          </Stack>
            {/* Existing categories: heading + list of clickable tiles (open edit modal) */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1, mt: 1 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="subtitle2">Existing categories</Typography>
              <Tooltip title="Edit labels for this tenant's categories. Per-zone visibility is managed in &quot;Categories by zone&quot;.">
                <IconButton
                  size="small"
                  sx={{
                    ml: 0.5,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: '#efefef',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.8)',
                    },
                  }}
                >
                  <Typography component="span" sx={{ fontSize: 14, lineHeight: 1 }}>
                    i
                  </Typography>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {visibleCategories.map((c) => (
              <Box
                key={c.id}
                onClick={() => {
                  setEditingCategory(c)
                  setEditingLabel(c.label)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  bgcolor: '#272932',
                  border: '1px solid rgba(255,255,255,0.18)',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#37ebf3',
                    boxShadow: '0 0 0 1px rgba(55,235,243,0.3)',
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 500, color: 'text.primary' }} noWrap>
                    {c.label}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingCategory(c)
                    setEditingLabel(c.label)
                  }}
                  sx={{
                    ml: 1,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: '0px solid',
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                >
                  <Typography component="span" sx={{ fontSize: 32, lineHeight: 1 }}>
                    ⚙
                  </Typography>
                </IconButton>
              </Box>
            ))}
            {visibleCategories.length === 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No categories configured yet.
              </Typography>
            )}
          </Box>
          </Box>
        </Paper>
      )}

      {/* ---------- Categories by zone panel ---------- */}
      {section === 'zone-categories' && (
        <Box sx={{ mt: 2 }}>
          <Paper
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
            }}
          >
            {/* Zone selector + helper text */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TextField
                select
                size="small"
                label="Zone"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                {zones.map((z) => (
                  <MenuItem key={z.id} value={z.id}>
                    {z.name}
                  </MenuItem>
                ))}
              </TextField>
              {selectedZone && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Configure which categories are visible for this zone.
                </Typography>
              )}
            </Stack>

            {/* Per-category visibility checkboxes */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {zoneCategories.map((c) => (
                <FormControlLabel
                  key={c.id}
                  control={
                    <Checkbox
                      checked={c.visible_for_zone}
                      onChange={(e) => {
                        const value = e.target.checked
                        setZoneCategories((prev) =>
                          prev.map((p) =>
                            p.id === c.id ? { ...p, visible_for_zone: value } : p,
                          ),
                        )
                      }}
                    />
                  }
                  label={`${c.label} (${c.key})`}
                />
              ))}
              {zoneCategories.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No incident categories configured for this tenant.
                </Typography>
              )}
            </Box>

            {/* Save visibility (persists zone–category visibility for selected zone) */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                disabled={zoneSaving || !selectedZoneId}
                onClick={async () => {
                  if (!selectedZoneId) return
                  setZoneSaving(true)
                  try {
                    const payload = zoneCategories.map((c) => ({
                      incident_category_id: c.id,
                      visible: c.visible_for_zone,
                    }))
                    await setZoneIncidentCategories(selectedZoneId, payload)
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e)
                    setError(e instanceof Error ? e.message : 'Failed to save zone categories')
                  } finally {
                    setZoneSaving(false)
                  }
                }}
              >
                {zoneSaving ? 'Saving…' : 'Save visibility'}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ---------- Edit category modal (gradient/border/shadow; gear + title + close X) ---------- */}
      <Dialog
        open={!!editingCategory}
        onClose={() => {
          if (savingId) return
          setEditingCategory(null)
          setEditingLabel('')
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background:
              'linear-gradient(135deg, rgba(40,40,45,0.95) 0%, rgba(20,20,25,0.95) 100%)',
            border: '1px solid rgba(62,45,96,0.6)',
            boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
            borderRadius: 2.5,
            overflow: 'hidden',
          },
        }}
      >
        {/* Header: gear + "Edit category" + close X */}
        <DialogTitle
          sx={{
            m: 0,
            px: 2,
            py: 1.5,
            bgcolor: '#1e2026',
            borderBottom: '1px solid #3e2d60',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="span" sx={{ fontSize: 20, color: '#37ebf3' }}>
              ⚙
            </Typography>
            <Typography component="span" sx={{ fontWeight: 550 }}>
              Edit category
            </Typography>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => {
              if (savingId) return
              setEditingCategory(null)
              setEditingLabel('')
            }}
            sx={{
              border: 'none',
              background: 'transparent',
              cursor: savingId ? 'default' : 'pointer',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
            }}
          >
            <Typography component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
              ×
            </Typography>
          </Box>
        </DialogTitle>
        {/* Body: single Category field; Key shown read-only below */}
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Category"
            size="small"
            value={editingLabel}
            onChange={(e) => setEditingLabel(e.target.value)}
            autoFocus
            sx={{ mt: 0.5 }}
          />
          {editingCategory && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Key: <code>{editingCategory.key}</code>
            </Typography>
          )}
        </DialogContent>
        {/* Actions: Delete (red) + Save (purple) */}
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="text"
            color="error"
            size="small"
            disabled={!editingCategory || savingId === editingCategory?.id}
            onClick={() => {
              if (!editingCategory) return
              setDeleteConfirmCategory(editingCategory)
            }}
          >
            Delete category
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={
              !editingCategory ||
              !editingLabel.trim() ||
              savingId === editingCategory.id ||
              editingLabel.trim() === editingCategory.label
            }
            onClick={async () => {
              if (!editingCategory) return
              const trimmed = editingLabel.trim()
              if (!trimmed || trimmed === editingCategory.label) return
              setSavingId(editingCategory.id)
              try {
                const updated = await updateIncidentCategory(editingCategory.id, {
                  label: trimmed,
                })
                setCategories((prev) =>
                  prev.map((p) => (p.id === editingCategory.id ? updated : p)),
                )
                setError(null)
                setEditingCategory(null)
                setEditingLabel('')
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                setError(
                  err instanceof Error ? err.message : 'Failed to update category label',
                )
              } finally {
                setSavingId(null)
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete category sub-modal */}
      <Dialog
        open={!!deleteConfirmCategory}
        onClose={() => {
          if (savingId) return
          setDeleteConfirmCategory(null)
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete this category?</DialogTitle>
        <DialogContent>
          {deleteConfirmCategory && (
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              This will permanently delete{' '}
              <strong>{deleteConfirmCategory.label}</strong> (
              <code>{deleteConfirmCategory.key}</code>) for this tenant and all zones.
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            size="small"
            onClick={() => {
              if (savingId) return
              setDeleteConfirmCategory(null)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={!deleteConfirmCategory || savingId === deleteConfirmCategory?.id}
            onClick={async () => {
              if (!deleteConfirmCategory) return
              setSavingId(deleteConfirmCategory.id)
              try {
                await deleteIncidentCategory(deleteConfirmCategory.id)
                setCategories((prev) => prev.filter((p) => p.id !== deleteConfirmCategory.id))
                setZoneCategories((prev) => prev.filter((p) => p.id !== deleteConfirmCategory.id))
                setError(null)
                setEditingCategory(null)
                setEditingLabel('')
                setDeleteConfirmCategory(null)
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                setError(
                  err instanceof Error ? err.message : 'Failed to delete incident category',
                )
              } finally {
                setSavingId(null)
              }
            }}
          >
            Delete category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

