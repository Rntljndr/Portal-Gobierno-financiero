import { useEffect, useMemo, useState } from 'react'
import { servicios, type Servicio } from '@/data/services'
import type { Filters } from '../components/filter-bar'
import type { StatusTab } from '../components/status-tabs'
import type { ViewMode } from '../components/view-mode-toggle'

const EMPTY_FILTERS: Filters = {
  nombre: [], codigo: [], pep: [], pais: [], origen: [], rubro: [], gerenciaPadre: [], gerencia: [], equipo: [],
}

function isPendiente(s: Servicio) {
  return s.estado === 'Borrador' || s.estado === 'Requiere revisión'
}

function matchFilters(s: Servicio, f: Filters) {
  if (f.nombre.length && !f.nombre.includes(s.nombre)) return false
  if (f.codigo.length && !f.codigo.includes(s.codigo)) return false
  if (f.pep.length && !f.pep.includes(s.pep)) return false
  if (f.pais.length && !f.pais.includes(s.pais)) return false
  if (f.origen.length && !f.origen.includes(s.tipoOrigen)) return false
  if (f.rubro.length && !f.rubro.includes(s.rubro)) return false
  if (f.gerenciaPadre.length && !f.gerenciaPadre.includes(s.gerenciaPadre)) return false
  if (f.gerencia.length && !f.gerencia.includes(s.gerencia)) return false
  if (f.equipo.length && !f.equipo.includes(s.equipo)) return false
  return true
}

function readStoredViewMode(): ViewMode {
  try {
    return localStorage.getItem('rr_vista_modo') === 'tabla' ? 'tabla' : 'cards'
  } catch {
    return 'cards'
  }
}

export function useMisServicios() {
  const [allServicios, setAllServicios] = useState<Servicio[]>(servicios)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [statusTab, setStatusTab] = useState<StatusTab>('pendientes')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewModeState] = useState<ViewMode>(readStoredViewMode)

  const pageSize = viewMode === 'tabla' ? 15 : 9

  const filteredAll = useMemo(() => allServicios.filter((s) => matchFilters(s, filters)), [allServicios, filters])

  const buckets = useMemo(
    () => ({
      todos: filteredAll,
      pendientes: filteredAll.filter(isPendiente),
      enviados: filteredAll.filter((s) => s.estado === 'Enviado'),
      aprobados: filteredAll.filter((s) => s.estado === 'Aprobado'),
    }),
    [filteredAll],
  )

  const filtered = buckets[statusTab]
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageSafe = Math.min(page, totalPages)
  const paged = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  useEffect(() => setPage(1), [statusTab, filters, viewMode])

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const onChangeFilter = <K extends keyof Filters>(key: K, values: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: values }))

  const addServicios = (nuevos: Servicio[]) => setAllServicios((prev) => [...nuevos, ...prev])

  const sendSelected = () => {
    setAllServicios((prev) => prev.map((s) => (selectedIds.has(s.id) ? { ...s, estado: 'Enviado' } : s)))
    setSelectedIds(new Set())
  }

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem('rr_vista_modo', mode)
    } catch {
      // localStorage no disponible (modo privado, etc.) — el modo simplemente no persiste
    }
  }

  return {
    addServicios,
    sendSelected,
    filters,
    onChangeFilter,
    clearFilters: () => setFilters(EMPTY_FILTERS),
    statusTab,
    setStatusTab,
    counts: { todos: buckets.todos.length, pendientes: buckets.pendientes.length, enviados: buckets.enviados.length, aprobados: buckets.aprobados.length },
    page: pageSafe,
    totalPages,
    pageSize,
    paged,
    filteredCount: filtered.length,
    setPage,
    selectedIds,
    toggleSelected,
    filteredAll,
    viewMode,
    setViewMode,
  }
}
