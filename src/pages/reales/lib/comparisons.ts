import type { ComparisonSeries } from './reales-calc'

export interface Comparisons {
  presupuesto: boolean
  forecastSel: '' | 'forecastActual' | 'forecastAnterior'
  anioAnterior: boolean
}

export const EMPTY_COMPARISONS: Comparisons = { presupuesto: false, forecastSel: '', anioAnterior: false }

export function activeComparisonKeys(c: Comparisons): ComparisonSeries['key'][] {
  const keys: ComparisonSeries['key'][] = []
  if (c.presupuesto) keys.push('presupuesto')
  if (c.forecastSel) keys.push(c.forecastSel)
  if (c.anioAnterior) keys.push('anioAnterior')
  return keys
}
