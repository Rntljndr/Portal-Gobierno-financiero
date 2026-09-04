import { cn } from '@/shared/lib/utils'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { fmtReales, type RealesTotals } from '../lib/reales-calc'
import { DesvioChip } from '@/shared/ui'

interface RealesTableFooterProps {
  rowCount: number
  itemLabel: string
  identityColSpan: number
  monthTotals: number[]
  grandTotals: RealesTotals
  currency: string
}

export function RealesTableFooter({ rowCount, itemLabel, identityColSpan, monthTotals, grandTotals, currency }: RealesTableFooterProps) {
  const fmt = (n: number) => fmtReales(n, currency)

  return (
    <tfoot>
      <tr className="border-t-2 border-border bg-[#FAFBFE] font-bold">
        <td className="p-[13px_14px] sticky left-0 z-[1] bg-[#FAFBFE] text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">
          Total <span className="ml-2 text-[10.5px] font-medium text-muted-foreground">{rowCount} {itemLabel}</span>
        </td>
        <td colSpan={identityColSpan} className="bg-[#FAFBFE]" />
        {monthTotals.map((v, i) => (
          <td
            key={i}
            className={cn('p-[13px_6px] text-right font-mono text-[12.5px] tabular-nums whitespace-nowrap text-cs-gris-oscuro', (i === 0 || i === REALES_LAST_CLOSED) && 'border-l-2 border-l-[#D5DCF0]')}
          >
            {fmt(v)}
          </td>
        ))}
        <td className="p-[13px_14px] border-l-2 border-l-[#D5DCF0] text-right font-mono text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">{fmt(grandTotals.planAcum)}</td>
        <td className="p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap text-primary">{fmt(grandTotals.real)}</td>
        <td className={cn('p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap', grandTotals.desvioAcumMonto > 0 ? 'text-destructive' : 'text-success')}>
          {grandTotals.desvioAcumMonto >= 0 ? '+' : ''}
          {fmt(grandTotals.desvioAcumMonto)}
        </td>
        <td className="p-[13px_8px] text-center">
          <DesvioChip pct={grandTotals.desvioAcumPct} />
        </td>
        <td className="p-[13px_14px] border-l-2 border-l-[#D5DCF0] text-right font-mono text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">{fmt(grandTotals.plan)}</td>
        <td className="p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap text-[#6922E7]">{fmt(grandTotals.realMasForecast)}</td>
        <td className={cn('p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap', grandTotals.desvio > 0 ? 'text-destructive' : 'text-success')}>
          {grandTotals.desvio >= 0 ? '+' : ''}
          {fmt(grandTotals.desvio)}
        </td>
        <td className="p-[13px_8px] text-center">
          <DesvioChip pct={grandTotals.pctDesvio} />
        </td>
      </tr>
    </tfoot>
  )
}
