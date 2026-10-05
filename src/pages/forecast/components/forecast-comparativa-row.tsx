import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { monthKeys } from '@/data/reporteria'
import { DesvioChip } from '@/shared/ui'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { forecastIdentityDefaultVisible } from '../lib/forecast-identity-cols'
import { FORECAST_CHECKBOX_COL_W, FORECAST_SUBPEP_COL_W, forecastNameStickyLeft, forecastSubPepStickyLeft } from '../lib/forecast-checkbox-col'

/** Mismo acento que RealesComparisonRow (#E2E6F0, distinto del #CBD5E1 de la fila principal) — marca
 * los mismos cortes (inicio de año / cutoff) pero un tono más suave, coherente con el fondo punteado
 * de esta fila. */
function positionClass(i: number, cutoff: number) {
  return cn(i === 0 && 'border-l-2 border-l-[#E2E6F0]', i === cutoff && 'border-l-2 border-l-[#E2E6F0]')
}

interface ForecastComparativaRowProps {
  label: string
  color: string
  bg: string
  border: string
  /** Meses de la serie de referencia (Plan, o el mismo PEP en el forecast anterior elegido). */
  refMeses: Record<string, number>
  /** Totales del forecast activo para esta línea (real, realMasForecast) — contra lo que se compara. */
  totals: ResumenTotals
  /** "Propio" de la referencia en Acumulado (planAcum si es Plan, real del forecast anterior si no). */
  ownAcum: number
  /** "Propio" de la referencia en Proyección Anual (plan si es Plan, realMasForecast del anterior si no). */
  ownAnual: number
  cutoff: number
  variant: 'n4' | 'n7'
  /** Contenido extra a mostrar en las columnas de identidad, en la misma posición que ocuparía en la
   * fila principal (C5: la fila de Plan muestra acá su propia Llave de Distribución). */
  identityExtra?: { colIndex: number; content: ReactNode }
  /** Hay columna de checkbox (M7) — agrega el relleno correspondiente para que esta fila quede
   * alineada con la columna de nombre del servicio, no con la de checkbox. */
  hasCheckboxCol?: boolean
  /** Hay columna fija "SubPEP" (F, solo variant="n7") — mismo propósito que hasCheckboxCol. */
  hasSubPepCol?: boolean
  /** Cantidad de columnas de identidad visibles (botón "Columnas") — todas por defecto. */
  identityColCount?: number
}

/** Fila de comparación bajo cada línea de servicio (mismo patrón que RealesComparisonRow de Reales,
 * ver reales/components/reales-comparison-row.tsx) — el título queda en la misma columna sticky que el
 * nombre del servicio, alineado con él, y las columnas de Acumulado/Proyección Anual muestran el
 * desvío real de esta línea contra la referencia en vez de un "—" estático. */
export function ForecastComparativaRow({ label, color, bg, border, refMeses, totals, ownAcum, ownAnual, cutoff, variant, identityExtra, hasCheckboxCol, hasSubPepCol, identityColCount }: ForecastComparativaRowProps) {
  const desvioAcum = totals.real - ownAcum
  const desvioAcumPct = ownAcum !== 0 ? (desvioAcum / ownAcum) * 100 : null
  const desvioAnual = totals.realMasForecast - ownAnual
  const desvioAnualPct = ownAnual !== 0 ? (desvioAnual / ownAnual) * 100 : null
  const identityCols = identityColCount ?? forecastIdentityDefaultVisible(variant).length
  // F: mismas 3 paddings que RealesComparisonRow — etiqueta 5px_10px, meses 5px_6px, resumen 5px_8px
  // (antes una sola p-[6px_8px] reutilizada en todo, más angosta que la de Reales).
  const tdMes = 'p-[5px_6px] text-right text-[11px] text-muted-foreground'
  const tdResumen = 'p-[5px_8px] text-right text-[11px] text-muted-foreground'

  return (
    <tr className="border-t border-dashed border-border bg-[#F8F9FD]">
      {hasCheckboxCol && <td className={cn(FORECAST_CHECKBOX_COL_W, 'sticky left-0 z-[1] bg-[#F8F9FD]')} />}
      {hasSubPepCol && <td className={cn(FORECAST_SUBPEP_COL_W, 'sticky z-[1] bg-[#F8F9FD]', forecastSubPepStickyLeft(!!hasCheckboxCol))} />}
      <td className={cn('sticky z-[1] bg-[#F8F9FD] p-[5px_10px]', forecastNameStickyLeft(!!hasCheckboxCol, !!hasSubPepCol))}>
        <span className="rounded border px-1.5 py-0.5 text-[10px] font-bold" style={{ color, background: bg, borderColor: border }}>
          {label}
        </span>
      </td>
      {identityExtra ? (
        <>
          {identityExtra.colIndex > 0 && <td colSpan={identityExtra.colIndex} className="bg-[#F8F9FD]" />}
          <td className={cn(tdResumen, 'tabular-nums')}>{identityExtra.content}</td>
          {identityCols - identityExtra.colIndex - 1 > 0 && <td colSpan={identityCols - identityExtra.colIndex - 1} className="bg-[#F8F9FD]" />}
        </>
      ) : (
        identityCols > 0 && <td colSpan={identityCols} className="bg-[#F8F9FD]" />
      )}
      {monthKeys.map((k, i) => {
        const own = refMeses[k] || 0
        return (
          <td key={k} className={cn(tdMes, positionClass(i, cutoff))}>
            {formatForecastAmount(own)}
          </td>
        )
      })}
      <td className={cn(tdResumen, 'border-l-2 border-l-border font-semibold')}>{formatForecastAmount(ownAcum)}</td>
      <td className={tdResumen}>
        {desvioAcum >= 0 ? '+' : ''}
        {formatForecastAmount(desvioAcum)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={desvioAcumPct} />
      </td>
      <td className={cn(tdResumen, 'border-l-2 border-l-border font-semibold')}>{formatForecastAmount(ownAnual)}</td>
      <td className={tdResumen}>
        {desvioAnual >= 0 ? '+' : ''}
        {formatForecastAmount(desvioAnual)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={desvioAnualPct} />
      </td>
      {variant === 'n7' && <td colSpan={4} className={tdResumen}>—</td>}
      {variant === 'n4' && <td className={tdResumen}>—</td>}
    </tr>
  )
}
