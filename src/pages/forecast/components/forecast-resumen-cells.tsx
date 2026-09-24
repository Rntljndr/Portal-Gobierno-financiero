import { cn } from '@/shared/lib/utils'
import { DesvioChip } from '@/shared/ui'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { EjecucionBadge } from './ejecucion-badge'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

interface ForecastResumenCellsProps {
  totals: ResumenTotals
  fmt: (n: number) => string
}

/** Columnas de cierre copiadas de ForecastN4Historico/N7Historico (F): Total Plan, Acumulado Real,
 * Disponible, Real + Forecast, Desvío, % Desvío — Disponible (plan - real) se deriva acá, no existe
 * como campo propio de ResumenTotals (compartido con Reales/Preliminares). */
export function ForecastResumenCells({ totals, fmt }: ForecastResumenCellsProps) {
  const disponible = totals.plan - totals.real

  return (
    <>
      <td className={cn(td, 'border-l-2 border-l-border bg-primary/[0.03] text-right font-bold tabular-nums text-primary')}>{fmt(totals.plan)}</td>
      <td className={cn(td, 'text-right font-semibold tabular-nums')}>{fmt(totals.real)}</td>
      <td className={cn(td, 'text-right tabular-nums', disponible < 0 && 'text-destructive')}>{fmt(disponible)}</td>
      <td className={cn(td, 'border-l-2 border-l-border bg-primary/[0.03] text-right font-bold tabular-nums text-primary')}>{fmt(totals.realMasForecast)}</td>
      <td className={cn(td, 'bg-primary/[0.03] text-right tabular-nums', totals.desvio > 0 ? 'text-destructive' : 'text-success')}>
        {totals.desvio >= 0 ? '+' : ''}
        {fmt(totals.desvio)}
      </td>
      <td className={cn(td, 'bg-primary/[0.03] text-center')}>
        <div className="flex flex-col items-center gap-1">
          <DesvioChip pct={totals.pctDesvio} />
          <EjecucionBadge pct={totals.pctDesvio} />
        </div>
      </td>
    </>
  )
}
