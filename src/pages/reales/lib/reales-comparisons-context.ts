import { createContext } from 'react'
import type { ForecastRound } from '@/data/forecast'
import type { ComparisonSeries } from './reales-calc'
import type { Comparisons } from './comparisons'

export interface RealesComparisonsStore {
  comparisons: Comparisons
  setComparisons: (next: Comparisons) => void
  comparisonKeys: ComparisonSeries['key'][]
  forecastRound: ForecastRound | null
  collapsedRows: Set<string>
  toggleRowCollapse: (codigo: string) => void
  allRowsCollapsed: (codigos: string[]) => boolean
  toggleAllRows: (codigos: string[]) => void
  /** Ajuste R6: etiqueta del forecast activo para proyectar los meses futuros — el elegido en el drawer, o el último cerrado por defecto. */
  activeForecastLabel: string | null
}

/**
 * Ajuste R2: montado una sola vez en AppShell (como MesCierreProvider) para que la comparativa aplicada
 * en la vista N4 venga precargada al entrar al detalle de un N7/SubPEP, sin tener que volver a aplicarla.
 */
export const RealesComparisonsContext = createContext<RealesComparisonsStore | null>(null)
