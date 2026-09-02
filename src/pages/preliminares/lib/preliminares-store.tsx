import { useState, type ReactNode } from 'react'
import { preliminaresRows, type PreliminarN4Row } from '@/data/preliminares'
import { EMPTY_PRELIM_FILTERS } from './preliminares-filters-types'
import { PreliminaresContext, type PreliminaresStore } from './preliminares-context'

function setEstadoDefinitivo(rows: PreliminarN4Row[], n7Codigos: Set<string>): PreliminarN4Row[] {
  return rows.map((n4) => {
    const children = n4.children.map((c) => (n7Codigos.has(c.codigo) ? { ...c, estado: 'definitivo' as const, tipoActualizacion: 'manual' as const } : c))
    const estado = children.every((c) => c.estado === 'definitivo') ? ('definitivo' as const) : ('preliminar' as const)
    return { ...n4, children, estado }
  })
}

export function PreliminaresProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<PreliminarN4Row[]>(preliminaresRows)
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')
  const [filters, setFilters] = useState(EMPTY_PRELIM_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const markDefinitivo = (n7Codigos: string[]) => setRows((prev) => setEstadoDefinitivo(prev, new Set(n7Codigos)))

  const applyBulkUpload = (count: number) => {
    setRows((prev) => {
      const pending = prev.flatMap((n4) => n4.children.filter((c) => c.estado === 'preliminar')).slice(0, count)
      return setEstadoDefinitivo(prev, new Set(pending.map((c) => c.codigo)))
    })
  }

  const store: PreliminaresStore = {
    rows,
    markDefinitivo,
    applyBulkUpload,
    tab,
    setTab,
    filters,
    onChangeFilter: (key, value) => setFilters((f) => ({ ...f, [key]: value })),
    clearFilters: () => setFilters(EMPTY_PRELIM_FILTERS),
    filtersOpen,
    setFiltersOpen,
  }

  return <PreliminaresContext.Provider value={store}>{children}</PreliminaresContext.Provider>
}
