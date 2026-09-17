import { useState } from 'react'
import { MONTH_KEYS, MONTHS_BY_QUARTER, quarterState, type Quarter, type SelMonths } from '@/shared/lib/periodo'

export const TODAS = '__todas__'

export interface DireccionFilters {
  division: string
  bandera: string
  rubro: string
  /** Múltiple: en Destino USD se pueden comparar varios países a la vez; en Destino ML se exige uno solo. */
  pais: string[]
  periodoAnio: number
  periodoMeses: SelMonths
}

export const PERIODO_ANIOS = [2025, 2026, 2027]

export const DEFAULT_PERIODO_ANIO = 2026
export const DEFAULT_PERIODO_MESES: SelMonths = { ago: true }

const MONTH_LABEL_BY_KEY: Record<string, string> = Object.fromEntries(
  Object.values(MONTHS_BY_QUARTER).flat().map((m) => [m.key, m.label]),
)

export function periodoLabel(anio: number, meses: SelMonths): string {
  const selected = MONTH_KEYS.filter((k) => meses[k])
  if (selected.length === 0) return 'Sin período'
  if (selected.length === MONTH_KEYS.length) return `Todo ${anio}`

  const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4']
  const fullQuarters = quarters.filter((q) => quarterState(meses, q) === 'all')
  const activeQuarters = quarters.filter((q) => quarterState(meses, q) !== 'none')
  if (fullQuarters.length === activeQuarters.length && activeQuarters.length > 0) {
    return `${fullQuarters.join(', ')} ${anio}`
  }
  if (selected.length === 1) return `${MONTH_LABEL_BY_KEY[selected[0]]} ${anio}`
  return `${selected.length} meses · ${anio}`
}

export function useDireccionFilters() {
  const [filters, setFilters] = useState<DireccionFilters>({
    division: TODAS,
    bandera: TODAS,
    rubro: TODAS,
    pais: [],
    periodoAnio: DEFAULT_PERIODO_ANIO,
    periodoMeses: DEFAULT_PERIODO_MESES,
  })

  const onChange = <K extends keyof DireccionFilters>(key: K, value: DireccionFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const activeCount =
    [filters.division, filters.bandera, filters.rubro].filter((v) => v !== TODAS).length + (filters.pais.length > 0 ? 1 : 0)

  return { filters, onChange, activeCount }
}
