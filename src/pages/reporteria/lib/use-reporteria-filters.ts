import { useState } from 'react'

export interface ReporteriaFilters {
  paisOrigen: string[]
  paisDestino: string[]
  buscarServicio: string
  division: string[]
  bandera: string[]
  centroCosto: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
  cuentaContable: string[]
  codigoPep: string[]
}

const EMPTY: ReporteriaFilters = {
  paisOrigen: [], paisDestino: [], buscarServicio: '', division: [], bandera: [], centroCosto: [],
  gerenciaPadre: [], gerencia: [], equipo: [], cuentaContable: [], codigoPep: [],
}

const MULTI_KEYS: (keyof ReporteriaFilters)[] = [
  'paisOrigen', 'paisDestino', 'division', 'bandera', 'centroCosto', 'gerenciaPadre', 'gerencia', 'equipo', 'cuentaContable', 'codigoPep',
]

export function useReporteriaFilters() {
  const [filters, setFilters] = useState<ReporteriaFilters>(EMPTY)

  const onChange = <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const activeCount = MULTI_KEYS.reduce((acc, k) => acc + (filters[k] as string[]).length, 0) + (filters.buscarServicio.trim() ? 1 : 0)

  return { filters, onChange, clear: () => setFilters(EMPTY), activeCount }
}
