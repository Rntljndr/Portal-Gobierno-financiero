import { REALES_LAST_CLOSED, monthLabels } from '@/data/reales'

export interface ResumenColDef {
  key: string
  label: string
  sub?: string
}

/** Totales de los dos bloques de resumen (R1/P4). Compartido por Reales y Preliminares: mismas fórmulas, mismas etiquetas. */
export interface ResumenTotals {
  plan: number
  real: number
  realMasForecast: number
  desvio: number
  pctDesvio: number
  planAcum: number
  desvioAcumMonto: number
  desvioAcumPct: number | null
}

/** Bloque 1: comparación al mismo período (meses cerrados). Compartido por Reales y Preliminares. */
export function resumenAcumuladoLabel(lastClosed: number = REALES_LAST_CLOSED): string {
  if (lastClosed <= 0) return 'Acumulado'
  return `Acumulado ${monthLabels[0]}–${monthLabels[lastClosed - 1]}`
}

export const RESUMEN_ACUMULADO_COLS: ResumenColDef[] = [
  { key: 'total', label: 'Total' },
  { key: 'desvioAcum', label: 'Desvío' },
  { key: 'desvioAcumPct', label: 'Desvío %' },
]

/** Bloque 2: comparación del año completo. Compartido por Reales y Preliminares. */
export const PROYECCION_ANUAL_LABEL = 'Proyección Anual'
export const PROYECCION_ANUAL_COLS: ResumenColDef[] = [
  { key: 'totalAnual', label: 'Total Anual' },
  { key: 'desvioAnual', label: 'Desvío' },
  { key: 'desvioAnualPct', label: 'Desvío %' },
]
