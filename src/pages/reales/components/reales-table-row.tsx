import { cn } from '@/shared/lib/utils'
import { Icon, ResumenCells } from '@/shared/ui'
import { REALES_LAST_CLOSED } from '@/data/reales'
import type { RealesN7Row, RealesRow } from '@/data/reales'
import type { ForecastRound } from '@/data/forecast'
import { calcMonths, calcTotals, fmtReales, type ComparisonSeries } from '../lib/reales-calc'
import { realesColsForMode, REALES_SUBPEP_COL_W } from '../lib/reales-table-cols'
import { RealesComparisonRow } from './reales-comparison-row'
import { RealesSubPepCell } from './reales-subpep-cell'

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
  forecastRound?: ForecastRound | null
  collapsedRows?: Set<string>
  onToggleRowCollapse?: (codigo: string) => void
  showSubPepCol?: boolean
  onClick?: () => void
}

export function RealesTableRow({
  row,
  mode,
  visibleCols,
  currency,
  comparisons,
  forecastRound = null,
  collapsedRows = new Set(),
  onToggleRowCollapse = () => {},
  showSubPepCol = true,
  onClick,
}: RealesTableRowProps) {
  const months = calcMonths(row)
  const totals = calcTotals(row)
  const fmt = (n: number) => fmtReales(n, currency)
  const cols = realesColsForMode(mode).filter((c) => visibleCols.includes(c.key))
  const hasSubPeps = mode === 'n7' && !!row.subPeps?.length
  const showSubPep = mode === 'n7' && showSubPepCol
  const identitySticky = showSubPep ? 'left-[72px]' : 'left-0'
  const rowClickable = mode === 'n4' ? !!onClick : hasSubPeps && !!onClick
  const hasComparisons = comparisons.length > 0
  const rowCollapsed = collapsedRows.has(row.codigo)
  const showComparisons = hasComparisons && !rowCollapsed

  return (
    <>
      <tr
        className={cn('border-t border-border', rowClickable && 'cursor-pointer hover:bg-[#FBFCFE]')}
        onClick={rowClickable ? onClick : undefined}
        title={rowClickable && mode === 'n7' ? 'Ver SubPEPs' : undefined}
      >
        {showSubPep && (
          <RealesSubPepCell hasSubPeps={hasSubPeps} className={cn(td, 'sticky left-0 z-[1] bg-white text-center', REALES_SUBPEP_COL_W)} />
        )}
        <td className={cn(td, 'sticky z-[1] bg-white font-semibold text-foreground', identitySticky)}>
          <div className="flex items-center gap-1.5">
            {hasComparisons && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleRowCollapse(row.codigo)
                }}
                className="shrink-0 text-muted-foreground"
                aria-label={rowCollapsed ? 'Expandir comparativa' : 'Contraer comparativa'}
              >
                <Icon name={rowCollapsed ? 'chevron_down' : 'chevron_up'} size={12} color="currentColor" />
              </button>
            )}
            <span>{row.nombre}</span>
          </div>
        </td>
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
        <ResumenCells totals={totals} fmt={fmt} />
      </tr>
      {showComparisons &&
        comparisons.map((key) => (
          <RealesComparisonRow
            key={key}
            seriesKey={key}
            months={months}
            totals={totals}
            currency={currency}
            colsColSpan={cols.length}
            showSubPep={showSubPep}
            forecastRound={key === 'forecast' ? forecastRound : null}
          />
        ))}
    </>
  )
}
