import { useState } from 'react'
import { allMonthsSelected, type SelMonths } from '@/shared/lib/periodo'

export interface ConsolidadaFilters {
  buscar: string
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
  paisOrigen: string[]
  paisDestino: string[]
  division: string[]
  bandera: string[]
  rubro: string[]
  cuentaContable: string[]
  origenServicio: string[]
  meses: SelMonths
}

const MULTI_KEYS: (keyof ConsolidadaFilters)[] = [
  'gerenciaPadre', 'gerencia', 'equipo', 'paisOrigen', 'paisDestino', 'division', 'bandera', 'rubro', 'cuentaContable', 'origenServicio',
]

export function emptyConsolidadaFilters(): ConsolidadaFilters {
  return {
    buscar: '',
    gerenciaPadre: [],
    gerencia: [],
    equipo: [],
    paisOrigen: [],
    paisDestino: [],
    division: [],
    bandera: [],
    rubro: [],
    cuentaContable: [],
    origenServicio: [],
    meses: allMonthsSelected(),
  }
}

export function useConsolidadaFilters() {
  const [filters, setFilters] = useState<ConsolidadaFilters>(emptyConsolidadaFilters())

  const onChange = <K extends keyof ConsolidadaFilters>(key: K, value: ConsolidadaFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const onClear = () => setFilters(emptyConsolidadaFilters())

  const activeCount = MULTI_KEYS.filter((k) => (filters[k] as string[]).length > 0).length + (filters.buscar ? 1 : 0)

  return { filters, onChange, onClear, activeCount }
}
