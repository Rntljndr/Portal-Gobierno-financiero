import { cn } from '@/shared/lib/utils'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { DesvioChip } from './desvio-chip'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

/** Las 8 celdas de los bloques Resumen Acumulado + Proyección Anual (Ajustes R1/P4). Reutilizado por Reales y Preliminares. */
export function ResumenCells({ totals, fmt }: { totals: ResumenTotals; fmt: (n: number) => string }) {
  return (
    <>
      <td className={cn(td, 'border-l-2 border-l-border text-right font-mono tabular-nums')}>{fmt(totals.planAcum)}</td>
      <td className={cn(td, 'bg-primary/[0.03] text-right font-mono font-bold tabular-nums text-primary')}>{fmt(totals.real)}</td>
      <td className={cn(td, 'text-right font-mono font-semibold tabular-nums', totals.desvioAcumMonto > 0 ? 'text-destructive' : 'text-success')}>
        {totals.desvioAcumMonto >= 0 ? '+' : ''}
        {fmt(totals.desvioAcumMonto)}
      </td>
      <td className={cn(td, 'text-center')}>
        <DesvioChip pct={totals.desvioAcumPct} />
      </td>
      <td className={cn(td, 'border-l-2 border-l-border bg-primary/[0.03] text-right font-mono tabular-nums')}>{fmt(totals.plan)}</td>
      <td className={cn(td, 'bg-primary/[0.03] text-right font-mono font-bold tabular-nums text-primary')}>{fmt(totals.realMasForecast)}</td>
      <td className={cn(td, 'bg-primary/[0.03] text-right font-mono tabular-nums', totals.desvio > 0 ? 'text-destructive' : 'text-success')}>
        {totals.desvio >= 0 ? '+' : ''}
        {fmt(totals.desvio)}
      </td>
      <td className={cn(td, 'bg-primary/[0.03] text-center')}>
        <DesvioChip pct={totals.pctDesvio} />
      </td>
    </>
  )
}
