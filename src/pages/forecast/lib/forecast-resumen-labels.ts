import type { ResumenColDef } from '@/shared/lib/resumen-blocks'

/** Columnas de cierre copiadas de ForecastN4Historico/N7Historico (F: "desde total plan hasta
 * desvío") — reemplaza los dos bloques (Acumulado/Proyección Anual) que tenía esta tabla antes: ahora
 * es un único bloque plano de 6 columnas. "Disponible" (plan - real) no existe como campo propio en
 * ResumenTotals, se deriva en el momento (ver ForecastResumenCells). */
export const FORECAST_TAIL_LABEL = 'Resumen'
export const FORECAST_TAIL_COLS: ResumenColDef[] = [
  { key: 'plan', label: 'Total Plan' },
  { key: 'real', label: 'Acumulado Real' },
  { key: 'disponible', label: 'Disponible' },
  { key: 'realMasForecast', label: 'Real + Forecast' },
  { key: 'desvio', label: 'Desvío' },
  { key: 'pctDesvio', label: '% Desvío' },
]
