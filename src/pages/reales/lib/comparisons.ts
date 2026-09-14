import type { ComparisonSeries } from './reales-calc'

export interface Comparisons {
  presupuesto: boolean
  forecastRoundId: string | null
  anioAnterior: boolean
}

/** Estado usado por "Limpiar" en el drawer: ninguna comparativa activa. */
export const EMPTY_COMPARISONS: Comparisons = { presupuesto: false, forecastRoundId: null, anioAnterior: false }

/** Estado inicial de la vista (Ajuste R7): Presupuesto viene siempre activado por defecto; el usuario puede sumar otras desde el drawer. */
export const DEFAULT_COMPARISONS: Comparisons = { presupuesto: true, forecastRoundId: null, anioAnterior: false }

export function activeComparisonKeys(c: Comparisons): ComparisonSeries['key'][] {
  const keys: ComparisonSeries['key'][] = []
  if (c.presupuesto) keys.push('presupuesto')
  if (c.forecastRoundId) keys.push('forecast')
  if (c.anioAnterior) keys.push('anioAnterior')
  return keys
}
