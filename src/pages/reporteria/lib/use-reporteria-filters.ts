import { useState } from 'react'

export interface ReporteriaFilters {
  buscarServicio: string
  division: string[]
  bandera: string[]
  centroCosto: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
  cuentaContable: string[]
  codigoPep: string[]
  origenServicio: string[]
  referencia: string[]
  justificacion: string[]
  descripcion: string[]
}

export const EMPTY_REPORTERIA_FILTERS: ReporteriaFilters = {
  buscarServicio: '',
  division: [], bandera: [], centroCosto: [], gerenciaPadre: [], gerencia: [], equipo: [],
  cuentaContable: [], codigoPep: [], origenServicio: [], referencia: [], justificacion: [], descripcion: [],
}

const MULTI_KEYS = (Object.keys(EMPTY_REPORTERIA_FILTERS) as (keyof ReporteriaFilters)[]).filter((k) => k !== 'buscarServicio')

function countActive(f: ReporteriaFilters): number {
  return MULTI_KEYS.reduce((acc, k) => acc + (f[k] as string[]).length, 0) + (f.buscarServicio.trim() ? 1 : 0)
}

export function useReporteriaFilters() {
  const [draft, setDraft] = useState<ReporteriaFilters>(EMPTY_REPORTERIA_FILTERS)
  const [applied, setApplied] = useState<ReporteriaFilters>(EMPTY_REPORTERIA_FILTERS)

  const onChange = <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) => setDraft((prev) => ({ ...prev, [key]: value }))

  const onClear = () => {
    setDraft(EMPTY_REPORTERIA_FILTERS)
    setApplied(EMPTY_REPORTERIA_FILTERS)
  }

  const onApply = () => setApplied(draft)

  const loadFilters = (next: ReporteriaFilters) => {
    setDraft(next)
    setApplied(next)
  }

  const pending = JSON.stringify(draft) !== JSON.stringify(applied)

  return { draft, applied, onChange, onClear, onApply, pending, activeCount: countActive(applied), loadFilters }
}
