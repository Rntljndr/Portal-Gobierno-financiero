import { useEffect, useMemo, useState } from 'react'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import type { PrelimFilterOptions, PrelimFilters } from './preliminares-filters-types'
import { usePreliminaresStore } from './use-preliminares-store'
import { allSelectable, toggleGroupInSet, toggleInSet } from './selection-helpers'

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

function buildFilterOptions(rows: PreliminarN4Row[]): PrelimFilterOptions {
  return {
    pais: uniqSorted(rows.map((r) => r.pais)),
    gerenciaPadre: uniqSorted(rows.map((r) => r.gerenciaPadre)),
    gerencia: uniqSorted(rows.map((r) => r.gerencia)),
    equipo: uniqSorted(rows.map((r) => r.equipo)),
    centroCosto: uniqSorted(rows.flatMap((r) => r.children.map((c) => c.centroCosto))),
    asignacion: uniqSorted(rows.flatMap((r) => r.children.map((c) => c.asignacion))),
    bandera: uniqSorted(rows.flatMap((r) => r.children.map((c) => c.bandera))),
    cuentaContable: uniqSorted(rows.map((r) => r.cuentaContable)),
    moneda: uniqSorted(rows.map((r) => r.moneda)),
    pep: uniqSorted(rows.flatMap((r) => r.children.map((c) => c.codigo))),
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
  const store = usePreliminaresStore()
  const { rows, tab, setTab, filters, filtersOpen, setFiltersOpen } = store
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState<string | null>(null)

  const isN7 = tab === 'n7'

  const filteredN4 = useMemo(() => rows.filter((r) => matchN4Filters(r, filters)), [rows, filters])
  const n7Flat = useMemo(
    () => filteredN4.flatMap((r) => r.children.filter((c) => matchN7Filters(c, filters)).map((c) => ({ ...c, parentServicio: r.servicio, parentCodigo: r.codigo }))),
    [filteredN4, filters],
  )
  const activeData = isN7 ? n7Flat : filteredN4

  const options: PrelimFilterOptions = useMemo(() => buildFilterOptions(rows), [rows])

  useEffect(() => setPage(1), [filters, tab])
  useEffect(() => setSelected(new Set()), [tab, filters])
  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(null), 4000)
    return () => clearTimeout(t)
  }, [showToast])

  const totalPages = Math.max(1, Math.ceil(activeData.length / ROWS_PER_PAGE))
  const pageSafe = Math.min(page, totalPages)
  const paged = activeData.slice((pageSafe - 1) * ROWS_PER_PAGE, pageSafe * ROWS_PER_PAGE)

  const activeFilterCount = countActiveFilters(filters)
  const kpi = calcKpi(filteredN4)

  const toggleSelected = (codigo: string) => setSelected((prev) => toggleInSet(prev, codigo))

  const toggleSelectedN4 = (n4: PreliminarN4Row) => {
    const n7Codigos = n4.children.filter((c) => c.estado === 'preliminar').map((c) => c.codigo)
    setSelected((prev) => toggleGroupInSet(prev, n7Codigos))
  }

  const allSelectableCodigos = allSelectable(isN7, filteredN4, n7Flat)
  const allSelected = allSelectableCodigos.length > 0 && allSelectableCodigos.every((c) => selected.has(c))
  const toggleSelectAll = () => setSelected(new Set(allSelected ? [] : allSelectableCodigos))

  return {
    tab,
    setTab,
    isN7,
    filters,
    onChangeFilter: store.onChangeFilter,
    clearFilters: store.clearFilters,
    filtersOpen,
    setFiltersOpen,
    activeFilterCount,
    options,
    filteredN4,
    activeData,
    paged,
    totalFiltered: activeData.length,
    page: pageSafe,
    totalPages,
    pageSize: ROWS_PER_PAGE,
    setPage,
    kpi,
    totalServicio: filteredN4.length,
    conPrelim: filteredN4.filter((r) => r.children.some((c) => c.estado === 'preliminar')).length,
    definitivos: filteredN4.filter((r) => r.children.every((c) => c.estado === 'definitivo')).length,
    selected,
    toggleSelected,
    toggleSelectedN4,
    allSelected,
    toggleSelectAll,
    showConfirm,
    setShowConfirm,
    showToast,
    onConfirmGuardar: () => {
      store.markDefinitivo([...selected])
      setShowConfirm(false)
      setShowToast(`${selected.size} líneas pasadas a Definitivo correctamente`)
      setSelected(new Set())
    },
    onBulkUploadApplied: (count: number) => {
      store.applyBulkUpload(count)
      setShowToast(`${count} líneas actualizadas correctamente`)
    },
  }
}
