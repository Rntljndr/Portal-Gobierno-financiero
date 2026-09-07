import { useState, type ReactNode } from 'react'
import { preliminaresRows, PRELIM_MESES, type PreliminarN4Row } from '@/data/preliminares'
import { EMPTY_PRELIM_FILTERS } from './preliminares-filters-types'
import { PreliminaresContext, type PreliminaresStore } from './preliminares-context'
import { useMesCierre } from '@/shared/context/use-mes-cierre'

function setEstadoDefinitivo(rows: PreliminarN4Row[], n7Codigos: Set<string>): PreliminarN4Row[] {
  return rows.map((n4) => {
    const children = n4.children.map((c) => (n7Codigos.has(c.codigo) ? { ...c, estado: 'definitivo' as const, tipoActualizacion: 'manual' as const } : c))
    const estado = children.every((c) => c.estado === 'definitivo') ? ('definitivo' as const) : ('preliminar' as const)
    return { ...n4, children, estado }
  })
}

/** Ajuste P3: Cierre Contable cierra TODAS las líneas del mes en curso, sin importar si ya se habían pasado a Definitivo antes. */
function setTodoDefinitivo(rows: PreliminarN4Row[]): PreliminarN4Row[] {
  return rows.map((n4) => ({
    ...n4,
    estado: 'definitivo' as const,
    children: n4.children.map((c) => ({ ...c, estado: 'definitivo' as const })),
  }))
}

/** El mes siguiente abre con todo en Preliminar/Automática de nuevo — la sync nocturna de SAP vuelve a alimentar los datos. */
function resetTodoPreliminar(rows: PreliminarN4Row[]): PreliminarN4Row[] {
  return rows.map((n4) => ({
    ...n4,
    estado: 'preliminar' as const,
    children: n4.children.map((c) => ({ ...c, estado: 'preliminar' as const, tipoActualizacion: 'automatica' as const })),
  }))
}

export function PreliminaresProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<PreliminarN4Row[]>(preliminaresRows)
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')
  const [filters, setFilters] = useState(EMPTY_PRELIM_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mesIndex, setMesIndex] = useState(0)
  const mesCierre = useMesCierre()

  const markDefinitivo = (n7Codigos: string[]) => setRows((prev) => setEstadoDefinitivo(prev, new Set(n7Codigos)))

  const applyBulkUpload = (count: number) => {
    setRows((prev) => {
      const pending = prev.flatMap((n4) => n4.children.filter((c) => c.estado === 'preliminar')).slice(0, count)
      return setEstadoDefinitivo(prev, new Set(pending.map((c) => c.codigo)))
    })
  }

  /** Ajuste P3: cierre 100% manual — sin fecha automática. Cierra el mes actual y abre el siguiente ya en Preliminar. */
  const ejecutarCierreContable = () => {
    setRows((prev) => resetTodoPreliminar(setTodoDefinitivo(prev)))
    setMesIndex((i) => Math.min(i + 1, PRELIM_MESES.length - 1))
    mesCierre.cerrarMes()
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
    mesAbierto: PRELIM_MESES[mesIndex],
    mesAnterior: PRELIM_MESES[mesIndex - 1] ?? 'Julio 2026',
    ejecutarCierreContable,
  }

  return <PreliminaresContext.Provider value={store}>{children}</PreliminaresContext.Provider>
}
