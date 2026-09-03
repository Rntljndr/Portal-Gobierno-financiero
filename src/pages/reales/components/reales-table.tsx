import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/ui'
import { monthKeys, REALES_LAST_CLOSED } from '@/data/reales'
import type { RealesN7Row, RealesRow } from '@/data/reales'
import { calcMonths, calcTotals, fmtReales, type ComparisonSeries } from '../lib/reales-calc'
import { realesColsForMode, REALES_N4_COL_KEYS, REALES_N7_COL_KEYS } from '../lib/reales-table-cols'
import { RealesTableHeader } from './reales-table-header'
import { RealesTableRow } from './reales-table-row'
import { DesvioChip } from './desvio-chip'

interface RealesTableProps {
  rows: (RealesRow | RealesN7Row)[]
  mode: 'n4' | 'n7'
  visibleCols?: string[]
  currency: string
  comparisons: ComparisonSeries['key'][]
  onRowClick?: (row: RealesRow | RealesN7Row) => void
  itemLabel: string
  showFooter?: boolean
}

export function RealesTable({ rows, mode, visibleCols, currency, comparisons, onRowClick, itemLabel, showFooter = true }: RealesTableProps) {
  const cols = visibleCols ?? (mode === 'n7' ? REALES_N7_COL_KEYS : REALES_N4_COL_KEYS)
  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title={`Sin ${itemLabel} para mostrar`} text="Probá ajustar o limpiar los filtros aplicados." />
      </div>
    )
  }

  const monthTotals = monthKeys.map((_, i) => rows.reduce((s, r) => s + calcMonths(r)[i], 0))
  const grandTotals = rows.reduce(
    (acc, r) => {
      const t = calcTotals(r)
      return { plan: acc.plan + t.plan, real: acc.real + t.real, disponible: acc.disponible + t.disponible, realMasForecast: acc.realMasForecast + t.realMasForecast, desvio: acc.desvio + t.desvio }
    },
    { plan: 0, real: 0, disponible: 0, realMasForecast: 0, desvio: 0 },
  )
  const pctDesvio = grandTotals.plan > 0 ? (grandTotals.desvio / grandTotals.plan) * 100 : 0
  const fmt = (n: number) => fmtReales(n, currency)
  const identityColSpan = realesColsForMode(mode).filter((c) => cols.includes(c.key)).length

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <RealesTableHeader mode={mode} visibleCols={cols} />
        <tbody>
          {rows.map((row) => (
            <RealesTableRow key={row.codigo} row={row} mode={mode} visibleCols={cols} currency={currency} comparisons={comparisons} onClick={onRowClick ? () => onRowClick(row) : undefined} />
          ))}
        </tbody>
        {showFooter && (
        <tfoot>
          <tr className="border-t-2 border-border bg-[#FAFBFE] font-bold">
            <td className="p-[13px_14px] sticky left-0 z-[1] bg-[#FAFBFE] text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">
              Total <span className="ml-2 text-[10.5px] font-medium text-muted-foreground">{rows.length} {itemLabel}</span>
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
            <td className="p-[13px_14px] border-l-2 border-l-[#D5DCF0] text-right font-mono text-[12.5px] whitespace-nowrap text-cs-gris-oscuro">{fmt(grandTotals.plan)}</td>
            <td className="p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap text-primary">{fmt(grandTotals.real)}</td>
            <td className={cn('p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap', grandTotals.disponible >= 0 ? 'text-[#067647]' : 'text-[#B42318]')}>{fmt(grandTotals.disponible)}</td>
            <td className="p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap text-[#6922E7]">{fmt(grandTotals.realMasForecast)}</td>
            <td className={cn('p-[13px_14px] text-right font-mono text-[12.5px] whitespace-nowrap', grandTotals.desvio > 0 ? 'text-[#B42318]' : 'text-[#067647]')}>
              {grandTotals.desvio >= 0 ? '+' : ''}
              {fmt(grandTotals.desvio)}
            </td>
            <td className="p-[13px_8px] text-center">
              <DesvioChip pct={pctDesvio} />
            </td>
          </tr>
        </tfoot>
        )}
      </table>
    </div>
  )
}
