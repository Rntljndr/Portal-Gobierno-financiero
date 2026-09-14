import { cn } from '@/shared/lib/utils'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'
import { DesvioChip } from './desvio-chip'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

interface ResumenCellsProps {
  totals: ResumenTotals
  fmt: (n: number) => string
  /** Cuando hay una fila de comparativa activa (Ajuste R7), esa fila ya muestra el desvío contra el campo agregado — la línea del PEP solo muestra los totales, sin desvío $/%. */
  hideDesvio?: boolean
}

/** Las 6 celdas de los bloques Resumen Acumulado + Proyección Anual (Ajustes R1/P4): una columna "Total" por bloque + desvío monto/%. Reutilizado por Reales y Preliminares. */
export function ResumenCells({ totals, fmt, hideDesvio = false }: ResumenCellsProps) {
  return (
    <>
      <td className={cn(td, 'border-l-2 border-l-border bg-primary/[0.03] text-right font-bold tabular-nums text-primary')}>{fmt(totals.real)}</td>
      <td className={cn(td, 'text-right font-semibold tabular-nums', !hideDesvio && (totals.desvioAcumMonto > 0 ? 'text-destructive' : 'text-success'))}>
        {!hideDesvio && (
          <>
            {totals.desvioAcumMonto >= 0 ? '+' : ''}
            {fmt(totals.desvioAcumMonto)}
          </>
        )}
      </td>
      <td className={cn(td, 'text-center')}>{!hideDesvio && <DesvioChip pct={totals.desvioAcumPct} />}</td>
      <td className={cn(td, 'border-l-2 border-l-border bg-primary/[0.03] text-right font-bold tabular-nums text-primary')}>{fmt(totals.realMasForecast)}</td>
      <td className={cn(td, 'bg-primary/[0.03] text-right tabular-nums', !hideDesvio && (totals.desvio > 0 ? 'text-destructive' : 'text-success'))}>
        {!hideDesvio && (
          <>
            {totals.desvio >= 0 ? '+' : ''}
            {fmt(totals.desvio)}
          </>
        )}
      </td>
      <td className={cn(td, 'bg-primary/[0.03] text-center')}>{!hideDesvio && <DesvioChip pct={totals.pctDesvio} />}</td>
    </>
  )
}
