import { useState } from 'react'

export interface ConsolidadoFilters {
  buscar: string
  paisDestino: string[]
  gerenciaPadre: string[]
  tipoGasto: string[]
  gerencia: string[]
  equipo: string[]
  paisOrigen: string[]
  rubro: string[]
  division: string[]
  bandera: string[]
  cuentaContable: string[]
}

const MULTI_KEYS: (keyof ConsolidadoFilters)[] = [
  'paisDestino', 'gerenciaPadre', 'tipoGasto', 'gerencia', 'equipo', 'paisOrigen', 'rubro', 'division', 'bandera', 'cuentaContable',
]

export function emptyConsolidadoFilters(): ConsolidadoFilters {
  return {
    buscar: '',
    paisDestino: [],
    gerenciaPadre: [],
    tipoGasto: [],
    gerencia: [],
    equipo: [],
    paisOrigen: [],
    rubro: [],
    division: [],
    bandera: [],
    cuentaContable: [],
  }
}

export function useConsolidadoFilters() {
  const [filters, setFilters] = useState<ConsolidadoFilters>(emptyConsolidadoFilters())

  const onChange = <K extends keyof ConsolidadoFilters>(key: K, value: ConsolidadoFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const onClear = () => setFilters(emptyConsolidadoFilters())

  const activeCount = MULTI_KEYS.filter((k) => (filters[k] as string[]).length > 0).length + (filters.buscar ? 1 : 0)

  return { filters, onChange, onClear, activeCount }
}
