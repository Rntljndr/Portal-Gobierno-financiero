import { Fragment, useMemo } from 'react'
import { EmptyState } from '@/shared/ui'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { calcN4Meses, calcN4Totals, findPlanN4, sumN4Totals } from '../lib/forecast-edit-calc'
import { sortForecastRows, useForecastSort } from '../lib/forecast-sort'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN4TableRow } from './forecast-n4-table-row'
import { ForecastPlanRow } from './forecast-plan-row'
import { ForecastTableFooter } from './forecast-table-footer'

interface ForecastN4TableProps {
  roundId: string
  rows: ForecastN4Linea[]
  cutoff: number
  onEditMonth?: (n4: ForecastN4Linea, monthKey: string, monthLabel: string, currentValue: number) => void
  readOnly?: boolean
}

export function ForecastN4Table({ roundId, rows, cutoff, onEditMonth, readOnly = false }: ForecastN4TableProps) {
  const { col, dir, onSort } = useForecastSort(roundId)
  const sortedRows = useMemo(
    () => sortForecastRows(rows, col, dir, (n4) => n4.n4Nombre, (n4) => calcN4Totals(n4, cutoff)),
    [rows, col, dir, cutoff],
  )

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin servicios para mostrar" text="Este forecast no tiene PEPs N4 habilitados." />
      </div>
    )
  }

  const monthTotals = monthKeys.map((k) => rows.reduce((s, n4) => s + (calcN4Meses(n4)[k] || 0), 0))
  const grandTotals = sumN4Totals(rows, cutoff)

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <ForecastTableHeader cutoff={cutoff} identityLabel="Servicio N4" variant="n4" sortCol={col} sortDir={dir} onSort={onSort} />
        <tbody>
          {sortedRows.map((n4) => (
            <Fragment key={n4.n4Codigo}>
              <ForecastN4TableRow roundId={roundId} n4={n4} cutoff={cutoff} onEditMonth={onEditMonth} readOnly={readOnly} />
              <ForecastPlanRow plan={findPlanN4(n4.n4Codigo)} cutoff={cutoff} variant="n4" />
            </Fragment>
          ))}
        </tbody>
        <ForecastTableFooter rowCount={rows.length} itemLabel="servicios N4" cutoff={cutoff} variant="n4" monthTotals={monthTotals} grandTotals={grandTotals} />
      </table>
    </div>
  )
}
