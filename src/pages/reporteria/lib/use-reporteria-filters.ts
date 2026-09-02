import { useState } from 'react'
import { allMonthsSelected, isPeriodoActive, type SelMonths } from './periodo'

export interface ReporteriaFilters {
  paisOrigen: string[]
  paisDestino: string[]
  forecastVersion: string
  selMonths: SelMonths
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

function createDefaultFilters(): ReporteriaFilters {
  return {
    paisOrigen: [],
    paisDestino: [],
    forecastVersion: 'F2_2027',
    selMonths: allMonthsSelected(),
    buscarServicio: '',
    division: [], bandera: [], centroCosto: [], gerenciaPadre: [], gerencia: [], equipo: [],
    cuentaContable: [], codigoPep: [], origenServicio: [], referencia: [], justificacion: [], descripcion: [],
  }
}

const COUNTED_MULTI_KEYS = [
  'division', 'bandera', 'centroCosto', 'gerenciaPadre', 'gerencia', 'equipo',
  'cuentaContable', 'codigoPep', 'origenServicio', 'referencia', 'justificacion', 'descripcion',
] as const satisfies readonly (keyof ReporteriaFilters)[]

function countActive(f: ReporteriaFilters): number {
  const fromMulti = COUNTED_MULTI_KEYS.reduce((acc, k) => acc + (f[k] as string[]).length, 0)
  return fromMulti + (f.buscarServicio.trim() ? 1 : 0) + (isPeriodoActive(f.selMonths) ? 1 : 0)
}

export function useReporteriaFilters() {
  const [draft, setDraft] = useState<ReporteriaFilters>(createDefaultFilters)
  const [applied, setApplied] = useState<ReporteriaFilters>(createDefaultFilters)

  const onChange = <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) => setDraft((prev) => ({ ...prev, [key]: value }))

  const onClear = () => {
    const next = { ...createDefaultFilters(), paisOrigen: draft.paisOrigen, paisDestino: draft.paisDestino, forecastVersion: draft.forecastVersion }
    setDraft(next)
    setApplied(next)
  }

  const onApply = () => setApplied(draft)

  const loadFilters = (next: ReporteriaFilters) => {
    setDraft(next)
    setApplied(next)
  }

  const pending = JSON.stringify(draft) !== JSON.stringify(applied)

  return { draft, applied, onChange, onClear, onApply, pending, activeCount: countActive(applied), loadFilters }
}
