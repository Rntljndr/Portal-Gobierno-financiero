import { cn } from '@/shared/lib/utils'
import { DesvioChip } from '@/shared/ui'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { EjecucionBadge } from './ejecucion-badge'
import { FORECAST_IDENTITY_COL_COUNT } from '../lib/forecast-identity-cols'

interface ForecastTableFooterProps {
  rowCount: number
  itemLabel: string
  cutoff: number
  variant: 'n4' | 'n7'
  monthTotals: number[]
  grandTotals: ResumenTotals
}

/** Fila de totales, compartida por las tablas N4 y N7 de edición de Forecast. */
export function ForecastTableFooter({ rowCount, itemLabel, cutoff, variant, monthTotals, grandTotals }: ForecastTableFooterProps) {
  const disponible = grandTotals.plan - grandTotals.real

  return (
    <tfoot>
      <tr className="border-t-2 border-border bg-[#FAFBFE] font-bold">
        <td colSpan={FORECAST_IDENTITY_COL_COUNT[variant]} className="sticky left-0 z-[1] bg-[#FAFBFE] p-[13px_14px] text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">
          Total <span className="ml-2 text-[10.5px] font-medium text-muted-foreground">{rowCount} {itemLabel}</span>
        </td>
        {monthTotals.map((v, i) => (
          <td key={i} className={cn('p-[13px_6px] text-right text-[12.5px] tabular-nums whitespace-nowrap text-cs-gris-oscuro', (i === 0 || i === cutoff) && 'border-l-2 border-l-[#D5DCF0]')}>
            {formatForecastAmount(v)}
          </td>
        ))}
        <td className="border-l-2 border-l-[#D5DCF0] p-[13px_14px] text-right text-[12.5px] whitespace-nowrap text-primary">{formatForecastAmount(grandTotals.plan)}</td>
        <td className="p-[13px_14px] text-right text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">{formatForecastAmount(grandTotals.real)}</td>
        <td className={cn('p-[13px_14px] text-right text-[12.5px] whitespace-nowrap', disponible < 0 && 'text-destructive')}>{formatForecastAmount(disponible)}</td>
        <td className="border-l-2 border-l-[#D5DCF0] p-[13px_14px] text-right text-[12.5px] whitespace-nowrap text-[#6922E7]">{formatForecastAmount(grandTotals.realMasForecast)}</td>
        <td className={cn('p-[13px_14px] text-right text-[12.5px] whitespace-nowrap', grandTotals.desvio > 0 ? 'text-destructive' : 'text-success')}>
          {grandTotals.desvio >= 0 ? '+' : ''}
          {formatForecastAmount(grandTotals.desvio)}
        </td>
        <td className="p-[13px_8px] text-center">
          <div className="flex flex-col items-center gap-1">
            <DesvioChip pct={grandTotals.pctDesvio} />
            <EjecucionBadge pct={grandTotals.pctDesvio} />
          </div>
        </td>
        {variant === 'n7' && <td colSpan={3} />}
      </tr>
    </tfoot>
  )
}
