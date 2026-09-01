import { useEffect, useMemo, useState } from 'react'
import { pepsN4, type PepN4Row } from '@/data/peps'
import type { PepFilters } from '../components/peps-filters'
import { nextSort, sortPeps, type SortColumn, type SortDir } from './sort-peps'

const EMPTY_FILTERS: PepFilters = { pep: '', cod: '', servicio: '', pais: [], moneda: [], area: [], cuenta: [], fechaDesde: '', fechaHasta: '' }

const ROWS_PER_PAGE = 10

function matchFilters(r: PepN4Row, f: PepFilters) {
  if (f.pep && !r.pep.toLowerCase().includes(f.pep.toLowerCase())) return false
  if (f.cod && !r.cod.toLowerCase().includes(f.cod.toLowerCase())) return false
  if (f.servicio && !r.servicio.toLowerCase().includes(f.servicio.toLowerCase())) return false
  if (f.pais.length && !f.pais.includes(r.pais)) return false
  if (f.moneda.length && !f.moneda.includes(r.moneda)) return false
  if (f.area.length && !f.area.includes(r.area)) return false
  if (f.cuenta.length && !f.cuenta.includes(r.cuenta)) return false
  if (f.fechaDesde && r.fechaCreacion < f.fechaDesde) return false
  if (f.fechaHasta && r.fechaCreacion > f.fechaHasta) return false
  return true
}

export function usePeps() {
  const [rows, setRows] = useState<PepN4Row[]>(pepsN4)
  const [filters, setFilters] = useState<PepFilters>(EMPTY_FILTERS)
  const [sortCol, setSortCol] = useState<SortColumn>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => rows.filter((r) => matchFilters(r, filters)), [rows, filters])
  const sorted = useMemo(() => sortPeps(filtered, sortCol, sortDir), [filtered, sortCol, sortDir])

  useEffect(() => setPage(1), [filters])

  const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE))
  const pageSafe = Math.min(page, totalPages)
  const paged = sorted.slice((pageSafe - 1) * ROWS_PER_PAGE, pageSafe * ROWS_PER_PAGE)

  const activeCount = filters.pep || filters.cod || filters.servicio || filters.fechaDesde || filters.fechaHasta
    ? [filters.pep, filters.cod, filters.servicio, filters.fechaDesde, filters.fechaHasta].filter(Boolean).length
    : 0
  const totalActiveFilters = activeCount + filters.pais.length + filters.moneda.length + filters.area.length + filters.cuenta.length

  const onChangeFilter = <K extends keyof PepFilters>(key: K, value: PepFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  return {
    rows,
    addPep: (row: PepN4Row) => setRows((prev) => [row, ...prev]),
    filters,
    onChangeFilter,
    clearFilters: () => setFilters(EMPTY_FILTERS),
    activeFilterCount: totalActiveFilters,
    sortCol,
    sortDir,
    onSort: (col: NonNullable<SortColumn>) => {
      const next = nextSort(sortCol, sortDir, col)
      setSortCol(next.col)
      setSortDir(next.dir)
    },
    page: pageSafe,
    totalPages,
    pageSize: ROWS_PER_PAGE,
    paged,
    totalFiltered: sorted.length,
    setPage,
  }
}
