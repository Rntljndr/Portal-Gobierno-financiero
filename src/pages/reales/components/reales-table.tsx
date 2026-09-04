import { EmptyState } from '@/shared/ui'
import { monthKeys } from '@/data/reales'
import type { RealesN7Row, RealesRow } from '@/data/reales'
import type { ForecastRound } from '@/data/forecast'
import { calcMonths, sumTotals, type ComparisonSeries } from '../lib/reales-calc'
import { realesColsForMode, REALES_N4_COL_KEYS, REALES_N7_COL_KEYS } from '../lib/reales-table-cols'
import { RealesTableHeader } from './reales-table-header'
import { RealesTableRow } from './reales-table-row'
import { RealesTableFooter } from './reales-table-footer'

interface RealesTableProps {
  rows: (RealesRow | RealesN7Row)[]
  mode: 'n4' | 'n7'
  visibleCols?: string[]
  currency: string
  comparisons: ComparisonSeries['key'][]
  forecastRound?: ForecastRound | null
  collapsedRows?: Set<string>
  onToggleRowCollapse?: (codigo: string) => void
  showSubPepCol?: boolean
  identityLabel?: string
  onRowClick?: (row: RealesRow | RealesN7Row) => void
  itemLabel: string
  showFooter?: boolean
}

export function RealesTable({
  rows,
  mode,
  visibleCols,
  currency,
  comparisons,
  forecastRound = null,
  collapsedRows = new Set(),
  onToggleRowCollapse = () => {},
  showSubPepCol = true,
  identityLabel,
  onRowClick,
  itemLabel,
  showFooter = true,
}: RealesTableProps) {
  const cols = visibleCols ?? (mode === 'n7' ? REALES_N7_COL_KEYS : REALES_N4_COL_KEYS)
  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title={`Sin ${itemLabel} para mostrar`} text="Probá ajustar o limpiar los filtros aplicados." />
      </div>
    )
  }

  const monthTotals = monthKeys.map((_, i) => rows.reduce((s, r) => s + calcMonths(r)[i], 0))
  const grandTotals = sumTotals(rows)
  const identityColSpan = realesColsForMode(mode).filter((c) => cols.includes(c.key)).length + (mode === 'n7' && showSubPepCol ? 1 : 0)

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <RealesTableHeader mode={mode} visibleCols={cols} showSubPepCol={showSubPepCol} identityLabel={identityLabel} />
        <tbody>
          {rows.map((row) => (
            <RealesTableRow
              key={row.codigo}
              row={row}
              mode={mode}
              visibleCols={cols}
              currency={currency}
              comparisons={comparisons}
              forecastRound={forecastRound}
              collapsedRows={collapsedRows}
              onToggleRowCollapse={onToggleRowCollapse}
              showSubPepCol={showSubPepCol}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            />
          ))}
        </tbody>
        {showFooter && (
          <RealesTableFooter rowCount={rows.length} itemLabel={itemLabel} identityColSpan={identityColSpan} monthTotals={monthTotals} grandTotals={grandTotals} currency={currency} />
        )}
      </table>
    </div>
  )
}
