import { cn } from '@/shared/lib/utils'
import { REALES_LAST_CLOSED } from '@/data/reales'
import type { RealesN7Row, RealesRow } from '@/data/reales'
import { calcMonths, calcTotals, fmtReales, type ComparisonSeries } from '../lib/reales-calc'
import { realesColsForMode } from '../lib/reales-table-cols'
import { DesvioChip } from './desvio-chip'
import { RealesComparisonRow } from './reales-comparison-row'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function monthCellClass(closed: boolean, i: number) {
  return cn(
    'p-[10px_6px] text-right font-mono text-[11.5px] tabular-nums',
    closed ? 'bg-primary/[0.03] text-foreground' : 'text-muted-foreground',
    i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'),
    i === REALES_LAST_CLOSED && 'border-l-2 border-l-[#CBD5E1]',
  )
}

interface RealesTableRowProps {
  row: RealesRow | RealesN7Row
  mode: 'n4' | 'n7'
  visibleCols: string[]
  currency: string
  comparisons: ComparisonSeries['key'][]
  onClick?: () => void
}

export function RealesTableRow({ row, mode, visibleCols, currency, comparisons, onClick }: RealesTableRowProps) {
  const months = calcMonths(row)
  const totals = calcTotals(row)
  const fmt = (n: number) => fmtReales(n, currency)
  const cols = realesColsForMode(mode).filter((c) => visibleCols.includes(c.key))
  const identityColSpan = cols.length

  return (
    <>
      <tr className={cn('border-t border-border', onClick && 'cursor-pointer hover:bg-[#FBFCFE]')} onClick={onClick}>
        <td className={cn(td, 'sticky left-0 z-[1] bg-white font-semibold text-foreground')}>{mode === 'n7' ? (row as RealesN7Row).parentNombre : row.nombre}</td>
        {cols.map((c) => (
          <td key={c.key} className={cn(td, c.key === 'nombre' && 'font-semibold text-foreground')}>
            {c.render(row)}
          </td>
        ))}
        {months.map((v, i) => (
          <td key={i} className={monthCellClass(i < REALES_LAST_CLOSED, i)}>
            {fmt(v)}
          </td>
        ))}
        <td className={cn(td, 'border-l-2 border-l-border text-right font-mono tabular-nums')}>{fmt(totals.plan)}</td>
        <td className={cn(td, 'bg-primary/[0.03] text-right font-mono font-bold tabular-nums text-primary')}>{fmt(totals.real)}</td>
        <td className={cn(td, 'text-right font-mono font-semibold tabular-nums', totals.disponible >= 0 ? 'text-[#067647]' : 'text-[#B42318]')}>{fmt(totals.disponible)}</td>
        <td className={cn(td, 'text-right font-mono font-semibold tabular-nums text-[#6922E7]')}>{fmt(totals.realMasForecast)}</td>
        <td className={cn(td, 'text-right font-mono tabular-nums', totals.desvio > 0 ? 'text-[#B42318]' : 'text-[#067647]')}>
          {totals.desvio >= 0 ? '+' : ''}
          {fmt(totals.desvio)}
        </td>
        <td className={cn(td, 'text-center')}>
          <DesvioChip pct={totals.pctDesvio} />
        </td>
      </tr>
      {comparisons.map((key) => (
        <RealesComparisonRow key={key} seriesKey={key} months={months} totals={totals} currency={currency} identityColSpan={identityColSpan} />
      ))}
    </>
  )
}
