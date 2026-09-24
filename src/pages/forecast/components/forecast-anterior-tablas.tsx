import { FORECAST_MES_ACTUAL, type ForecastRound } from '@/data/forecast'
import { buildFlatN7Rows } from '../lib/forecast-flat-n7'
import { ForecastN4Table } from './forecast-n4-table'
import { ForecastN7FlatTable } from './forecast-n7-flat-table'

/** Servicios N4 y N7 de un forecast anterior, cada uno en su propia tabla, una línea por servicio +
 * su fila de Plan (F: "servicios a nivel 4 y nivel 7 del forecast y el plan ... 1 línea cada uno").
 * Ambas tablas son de solo lectura — reutiliza ForecastN4Table (con `readOnly`) y ForecastN7FlatTable
 * (ya es de solo lectura por diseño). Extraído aparte para mantener ForecastDetailPage bajo el
 * límite de líneas del linter. */
export function ForecastAnteriorTablas({ round }: { round: ForecastRound }) {
  const flatN7Rows = buildFlatN7Rows(round.lineas)

  return (
    <>
      <div className="mx-8 mb-2 text-[13px] font-bold text-foreground">Servicios N4</div>
      <ForecastN4Table roundId={round.id} rows={round.lineas} cutoff={FORECAST_MES_ACTUAL} readOnly />

      <div className="mx-8 mb-2 text-[13px] font-bold text-foreground">Servicios N7</div>
      <ForecastN7FlatTable roundId={round.id} rows={flatN7Rows} cutoff={FORECAST_MES_ACTUAL} />
    </>
  )
}
