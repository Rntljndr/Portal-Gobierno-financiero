import { useEffect, useMemo, useState } from 'react'
import { realesN7Rows, realesRows, type RealesN7Row, type RealesN4Row } from '@/data/reales'
import { EMPTY_REALES_FILTERS, type RealesFilterOptions, type RealesFilters } from './reales-filters-types'
import { EMPTY_COMPARISONS, activeComparisonKeys, type Comparisons } from './comparisons'

const ROWS_PER_PAGE = 10

function uniqSorted(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'))
}

function matchFilters(r: RealesN4Row | RealesN7Row, f: RealesFilters) {
  if (f.servicio && !r.nombre.toLowerCase().includes(f.servicio.toLowerCase())) return false
  if (f.codigo && !r.codigo.toLowerCase().includes(f.codigo.toLowerCase())) return false
  if (f.pais.length && !f.pais.includes(r.pais)) return false
  if (f.equipo.length && !f.equipo.includes(r.equipo)) return false
  if (f.gerenciaPadre.length && !f.gerenciaPadre.includes(r.gerenciaPadre)) return false
  if (f.gerencia.length && !f.gerencia.includes(r.gerencia)) return false
  if (f.centroCosto.length && !f.centroCosto.includes(r.centroCosto)) return false
  if (f.asignacion.length && !f.asignacion.includes(r.asignacion)) return false
  if (f.bandera.length && !f.bandera.includes(r.bandera)) return false
  if (f.cuentaContable.length && !f.cuentaContable.includes(r.cuentaContable)) return false
  if (f.moneda.length && !f.moneda.includes(r.moneda)) return false
  return true
}

export function useReales() {
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')
  const [filters, setFilters] = useState<RealesFilters>(EMPTY_REALES_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'local'>('USD')
  const [comparisons, setComparisons] = useState<Comparisons>(EMPTY_COMPARISONS)
  const [compDrawerOpen, setCompDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)

  const isN7 = tab === 'n7'

  const filteredN4 = useMemo(() => realesRows.filter((r) => matchFilters(r, filters)), [filters])
  const filteredN7 = useMemo(() => realesN7Rows.filter((r) => matchFilters(r, filters)), [filters])
  const activeData = isN7 ? filteredN7 : filteredN4

  const options: RealesFilterOptions = useMemo(
    () => ({
      pais: uniqSorted(realesRows.map((r) => r.pais)),
      equipo: uniqSorted(realesRows.map((r) => r.equipo)),
      gerenciaPadre: uniqSorted(realesRows.map((r) => r.gerenciaPadre)),
      gerencia: uniqSorted(realesRows.map((r) => r.gerencia)),
      centroCosto: uniqSorted(realesN7Rows.map((r) => r.centroCosto)),
      asignacion: uniqSorted(realesN7Rows.map((r) => r.asignacion)),
      bandera: uniqSorted(realesN7Rows.map((r) => r.bandera)),
      cuentaContable: uniqSorted(realesRows.map((r) => r.cuentaContable)),
      moneda: uniqSorted(realesRows.map((r) => r.moneda)),
    }),
    [],
  )

  useEffect(() => setPage(1), [filters, tab])

  const totalPages = Math.max(1, Math.ceil(activeData.length / ROWS_PER_PAGE))
  const pageSafe = Math.min(page, totalPages)
  const paged = activeData.slice((pageSafe - 1) * ROWS_PER_PAGE, pageSafe * ROWS_PER_PAGE)

  const activeFilterCount =
    (filters.servicio ? 1 : 0) +
    (filters.codigo ? 1 : 0) +
    filters.pais.length +
    filters.equipo.length +
    filters.gerenciaPadre.length +
    filters.gerencia.length +
    filters.centroCosto.length +
    filters.asignacion.length +
    filters.bandera.length +
    filters.cuentaContable.length +
    filters.moneda.length

  return {
    tab,
    setTab,
    isN7,
    filters,
    onChangeFilter: <K extends keyof RealesFilters>(key: K, value: RealesFilters[K]) => setFilters((f) => ({ ...f, [key]: value })),
    clearFilters: () => setFilters(EMPTY_REALES_FILTERS),
    filtersOpen,
    setFiltersOpen,
    activeFilterCount,
    options,
    currency,
    setCurrency,
    comparisons,
    setComparisons,
    comparisonKeys: activeComparisonKeys(comparisons),
    compDrawerOpen,
    setCompDrawerOpen,
    filteredN4,
    paged,
    totalFiltered: activeData.length,
    page: pageSafe,
    totalPages,
    pageSize: ROWS_PER_PAGE,
    setPage,
  }
}
