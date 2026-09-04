import type { ComparisonSeries } from './reales-calc'

export interface Comparisons {
  presupuesto: boolean
  forecastRoundId: string | null
  anioAnterior: boolean
}

export const EMPTY_COMPARISONS: Comparisons = { presupuesto: false, forecastRoundId: null, anioAnterior: false }
/** Estado inicial de la vista: Presupuesto visible por defecto sin que el usuario deba activarlo (Ajuste R2). */
export const DEFAULT_COMPARISONS: Comparisons = { ...EMPTY_COMPARISONS, presupuesto: true }

export function activeComparisonKeys(c: Comparisons): ComparisonSeries['key'][] {
  const keys: ComparisonSeries['key'][] = []
  if (c.presupuesto) keys.push('presupuesto')
  if (c.forecastRoundId) keys.push('forecast')
  if (c.anioAnterior) keys.push('anioAnterior')
  return keys
}
