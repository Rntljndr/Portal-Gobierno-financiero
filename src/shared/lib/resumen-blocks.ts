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
export const RESUMEN_ACUMULADO_LABEL = 'Resumen Acumulado'
export const RESUMEN_ACUMULADO_COLS: ResumenColDef[] = [
  { key: 'planAcum', label: 'Plan acumulado' },
  { key: 'realAcum', label: 'Real acumulado' },
  { key: 'desvioAcum', label: 'Desvío' },
  { key: 'desvioAcumPct', label: 'Desvío %' },
]

/** Bloque 2: comparación del año completo. Compartido por Reales y Preliminares. */
export const PROYECCION_ANUAL_LABEL = 'Proyección Anual'
export const PROYECCION_ANUAL_COLS: ResumenColDef[] = [
  { key: 'planAnual', label: 'Plan total' },
  { key: 'realFcAnual', label: 'Real + Forecast' },
  { key: 'desvioAnual', label: 'Desvío' },
  { key: 'desvioAnualPct', label: 'Desvío %' },
]
