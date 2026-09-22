import { cn } from '@/shared/lib/utils'
import { DesvioChip } from '@/shared/ui'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { EjecucionBadge } from './ejecucion-badge'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

interface ForecastResumenCellsProps {
  totals: ResumenTotals
  fmt: (n: number) => string
}

/** Igual a `ResumenCells` (compartido con Reales/Preliminares) pero suma la etiqueta Ahorro/En
 * ejecución/Sobre ejecución junto a cada chip de desvío (Ajuste T4). Se duplica acá en vez de tocar
 * el componente compartido, para no afectar Reales/Preliminares. */
export function ForecastResumenCells({ totals, fmt }: ForecastResumenCellsProps) {
  return (
    <>
      <td className={cn(td, 'border-l-2 border-l-border bg-primary/[0.03] text-right font-bold tabular-nums text-primary')}>{fmt(totals.real)}</td>
      <td className={cn(td, 'text-right font-semibold tabular-nums', totals.desvioAcumMonto > 0 ? 'text-destructive' : 'text-success')}>
        {totals.desvioAcumMonto >= 0 ? '+' : ''}
        {fmt(totals.desvioAcumMonto)}
      </td>
      <td className={cn(td, 'text-center')}>
        <div className="flex flex-col items-center gap-1">
          <DesvioChip pct={totals.desvioAcumPct} />
          <EjecucionBadge pct={totals.desvioAcumPct} />
        </div>
      </td>
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
