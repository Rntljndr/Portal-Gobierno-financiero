import type { ComparisonSeries } from './reales-calc'

export interface Comparisons {
  presupuesto: boolean
  forecastRoundId: string | null
  anioAnterior: boolean
}

/** Estado inicial de la vista: sin comparativas activas — el usuario las agrega desde el drawer y presiona Aplicar (Ajuste R2). */
export const EMPTY_COMPARISONS: Comparisons = { presupuesto: false, forecastRoundId: null, anioAnterior: false }

export function activeComparisonKeys(c: Comparisons): ComparisonSeries['key'][] {
  const keys: ComparisonSeries['key'][] = []
  if (c.presupuesto) keys.push('presupuesto')
  if (c.forecastRoundId) keys.push('forecast')
  if (c.anioAnterior) keys.push('anioAnterior')
  return keys
}
