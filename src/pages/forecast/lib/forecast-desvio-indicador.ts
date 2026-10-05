import type { ForecastMesNota } from '@/data/forecast-lineas'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { FORECAST_JUSTIFICACION_NIVEL } from './forecast-config'

export type ForecastDesvioIndicador = 'sin-desvio' | 'justificado' | 'sin-justificar'

export const FORECAST_DESVIO_INDICADOR_LABEL: Record<ForecastDesvioIndicador, string> = {
  'sin-desvio': 'Sin desvío',
  justificado: 'Con desvío – justificado',
  'sin-justificar': 'Con desvío – sin justificar',
}

function tieneNotaConJustificacion(notas: Record<string, ForecastMesNota>): boolean {
  return Object.values(notas).some((n) => !!n.justificacion)
}

/** Indicador de desvío por N7 (M5) — "Sin desvío" si el desvío % no supera el máximo configurado del
 * forecast; si lo supera, "justificado" o "sin-justificar" según haya alguna nota con justificación en
 * el nivel configurado (N4 o N7, FORECAST_JUSTIFICACION_NIVEL — mismo mecanismo que C11). No expone el
 * texto del motivo (M5: "no muestres el texto del motivo en la tabla"), solo la categoría. */
export function calcDesvioIndicador(
  totals: ResumenTotals,
  desvioMaximo: number,
  notas: { n4: Record<string, ForecastMesNota>; n7: Record<string, ForecastMesNota> },
): ForecastDesvioIndicador {
  const hayDesvio = Math.abs(totals.pctDesvio) > desvioMaximo
  if (!hayDesvio) return 'sin-desvio'
  const justificado = tieneNotaConJustificacion(FORECAST_JUSTIFICACION_NIVEL === 'n4' ? notas.n4 : notas.n7)
  return justificado ? 'justificado' : 'sin-justificar'
}
