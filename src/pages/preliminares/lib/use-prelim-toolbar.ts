import { useEffect, useMemo, useState } from 'react'
import type { PreliminarRow } from '@/data/preliminares'
import { usePreliminaresStore } from './use-preliminares-store'

interface UsePrelimToolbarOptions {
  rows: PreliminarRow[]
  /** Codigos que efectivamente se marcan Definitivo al confirmar (por defecto, los seleccionados tal cual). */
  markCodigos?: (selected: string[]) => string[]
}

/** Estado y handlers del toolbar completo (filtro, seleccionar todos, descargar, carga masiva, guardar definitivo, cierre contable), reusado en Preliminares N7 y SubPEP. */
export function usePrelimToolbar({ rows, markCodigos }: UsePrelimToolbarOptions) {
  const store = usePreliminaresStore()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showConfirm, setShowConfirm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showCierre, setShowCierre] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [cierreToast, setCierreToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const filteredRows = useMemo(() => {
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => r.servicio.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q))
  }, [rows, search])

  const allSelectableCodigos = filteredRows.filter((r) => r.estado === 'preliminar').map((r) => r.codigo)
  const allSelected = allSelectableCodigos.length > 0 && allSelectableCodigos.every((c) => selected.has(c))

  const toggleSelect = (codigo: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.add(codigo)
      return next
    })

  const toggleSelectAll = () => setSelected(new Set(allSelected ? [] : allSelectableCodigos))

  const confirmGuardar = () => {
    const codigos = markCodigos ? markCodigos([...selected]) : [...selected]
    store.markDefinitivo(codigos)
    setShowConfirm(false)
    setToast(`${selected.size} líneas pasadas a Definitivo correctamente`)
    setSelected(new Set())
  }

  const handleBulkUploadApplied = (count: number) => {
    store.applyBulkUpload(count)
    setToast(`${count} líneas actualizadas correctamente`)
  }

  const confirmCierre = () => {
    const mesQueCierra = store.mesAbierto
    store.ejecutarCierreContable()
    setShowCierre(false)
    setCierreToast(`Cierre Contable de ${mesQueCierra} ejecutado. Los datos están disponibles en Reales.`)
    setTimeout(() => setCierreToast(null), 4000)
  }

  return {
    filtersOpen,
    setFiltersOpen,
    search,
    setSearch,
    filteredRows,
    selected,
    toggleSelect,
    allSelected,
    toggleSelectAll,
    showConfirm,
    setShowConfirm,
    confirmGuardar,
    showBulkUpload,
    setShowBulkUpload,
    handleBulkUploadApplied,
    showCierre,
    setShowCierre,
    confirmCierre,
    mesAbierto: store.mesAbierto,
    toast,
    cierreToast,
  }
}
