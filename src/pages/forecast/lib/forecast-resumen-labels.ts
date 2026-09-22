import type { ResumenColDef } from '@/shared/lib/resumen-blocks'

/** Copia local de las etiquetas de resumen (Ajuste T8) — Forecast usa nomenclatura propia ("Real
 * (YTD)", "Forecast (YTG)", "Real + Forecast (Full Year)") distinta a la de Reales/Preliminares
 * ("Total", "Total Anual"), así que se duplican acá en vez de modificar `resumen-blocks.ts`
 * (compartido), para no afectar esos otros módulos. */
export const FORECAST_ACUMULADO_COLS: ResumenColDef[] = [
  { key: 'total', label: 'Real (YTD)' },
  { key: 'desvioAcum', label: 'Desvío' },
  { key: 'desvioAcumPct', label: 'Desvío %' },
]

export const FORECAST_PROYECCION_LABEL = 'Proyección Anual'
export const FORECAST_PROYECCION_COLS: ResumenColDef[] = [
  { key: 'totalAnual', label: 'Real + Forecast (Full Year)' },
  { key: 'desvioAnual', label: 'Desvío' },
  { key: 'desvioAnualPct', label: 'Desvío %' },
]
