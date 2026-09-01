import { useEffect, useMemo, useState } from 'react'
import { preliminaresRows, type PreliminarN4Row, type PreliminarRow } from '@/data/preliminares'
import { EMPTY_PRELIM_FILTERS, type PrelimFilterOptions, type PrelimFilters } from './preliminares-filters-types'

const ROWS_PER_PAGE = 10

function uniqSorted(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'))
}

function matchN4Filters(r: PreliminarN4Row, f: PrelimFilters) {
  if (f.servicio && !r.servicio.toLowerCase().includes(f.servicio.toLowerCase())) return false
  if (f.codigo && !r.codigo.toLowerCase().includes(f.codigo.toLowerCase())) return false
  if (f.pais.length && !f.pais.includes(r.pais)) return false
  if (f.gerenciaPadre.length && !f.gerenciaPadre.includes(r.gerenciaPadre)) return false
  if (f.gerencia.length && !f.gerencia.includes(r.gerencia)) return false
  if (f.equipo.length && !f.equipo.includes(r.equipo)) return false
  if (f.cuentaContable.length && !f.cuentaContable.includes(r.cuentaContable)) return false
  if (f.moneda.length && !f.moneda.includes(r.moneda)) return false
  return true
}

function matchN7Filters(c: PreliminarRow, f: PrelimFilters) {
  if (f.centroCosto.length && !f.centroCosto.includes(c.centroCosto)) return false
  if (f.asignacion.length && !f.asignacion.includes(c.asignacion)) return false
  if (f.bandera.length && !f.bandera.includes(c.bandera)) return false
  if (f.pep.length && !f.pep.includes(c.codigo)) return false
  return true
}

function buildFilterOptions(): PrelimFilterOptions {
  return {
    pais: uniqSorted(preliminaresRows.map((r) => r.pais)),
    gerenciaPadre: uniqSorted(preliminaresRows.map((r) => r.gerenciaPadre)),
    gerencia: uniqSorted(preliminaresRows.map((r) => r.gerencia)),
    equipo: uniqSorted(preliminaresRows.map((r) => r.equipo)),
    centroCosto: uniqSorted(preliminaresRows.flatMap((r) => r.children.map((c) => c.centroCosto))),
    asignacion: uniqSorted(preliminaresRows.flatMap((r) => r.children.map((c) => c.asignacion))),
    bandera: uniqSorted(preliminaresRows.flatMap((r) => r.children.map((c) => c.bandera))),
    cuentaContable: uniqSorted(preliminaresRows.map((r) => r.cuentaContable)),
    moneda: uniqSorted(preliminaresRows.map((r) => r.moneda)),
    pep: uniqSorted(preliminaresRows.flatMap((r) => r.children.map((c) => c.codigo))),
  }
}

function countActiveFilters(f: PrelimFilters): number {
  return (
    (f.servicio ? 1 : 0) +
    (f.codigo ? 1 : 0) +
    f.pais.length +
    f.gerenciaPadre.length +
    f.gerencia.length +
    f.equipo.length +
    f.centroCosto.length +
    f.asignacion.length +
    f.bandera.length +
    f.cuentaContable.length +
    f.moneda.length +
    f.pep.length
  )
}

function calcKpi(filteredN4: PreliminarN4Row[]) {
  const usdRows = filteredN4.filter((r) => r.moneda === 'USD')
  const planBase = usdRows.reduce((s, r) => s + r.acumReal + r.forecastMes * 5, 0)
  const acumReal = usdRows.reduce((s, r) => s + r.acumReal, 0)
  return { planBase, acumReal, disponible: planBase - acumReal }
}

export function usePreliminares() {
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')
  const [filters, setFilters] = useState<PrelimFilters>(EMPTY_PRELIM_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const isN7 = tab === 'n7'

  const filteredN4 = useMemo(() => preliminaresRows.filter((r) => matchN4Filters(r, filters)), [filters])
  const n7Flat = useMemo(
    () => filteredN4.flatMap((r) => r.children.filter((c) => matchN7Filters(c, filters)).map((c) => ({ ...c, parentServicio: r.servicio, parentCodigo: r.codigo }))),
    [filteredN4, filters],
  )
  const activeData = isN7 ? n7Flat : filteredN4

  const options: PrelimFilterOptions = useMemo(buildFilterOptions, [])

  useEffect(() => setPage(1), [filters, tab])
  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 4000)
    return () => clearTimeout(t)
  }, [showToast])

  const totalPages = Math.max(1, Math.ceil(activeData.length / ROWS_PER_PAGE))
  const pageSafe = Math.min(page, totalPages)
  const paged = activeData.slice((pageSafe - 1) * ROWS_PER_PAGE, pageSafe * ROWS_PER_PAGE)

  const activeFilterCount = countActiveFilters(filters)
  const kpi = calcKpi(filteredN4)

  return {
    tab,
    setTab,
    isN7,
    filters,
    onChangeFilter: <K extends keyof PrelimFilters>(key: K, value: PrelimFilters[K]) => setFilters((f) => ({ ...f, [key]: value })),
    clearFilters: () => setFilters(EMPTY_PRELIM_FILTERS),
    filtersOpen,
    setFiltersOpen,
    activeFilterCount,
    options,
    filteredN4,
    paged,
    totalFiltered: activeData.length,
    page: pageSafe,
    totalPages,
    pageSize: ROWS_PER_PAGE,
    setPage,
    kpi,
    totalServicio: filteredN4.length,
    conPrelim: filteredN4.filter((r) => r.preliminarMes > 0).length,
    definitivos: filteredN4.filter((r) => r.definitivo).length,
    showConfirm,
    setShowConfirm,
    showToast,
    onConfirmGuardar: () => {
      setShowConfirm(false)
      setShowToast(true)
    },
  }
}
