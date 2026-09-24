import { Fragment, useMemo } from 'react'
import { EmptyState } from '@/shared/ui'
import { monthKeys } from '@/data/reporteria'
import { calcN7Totals, findPlanN7, sumN7TotalsFlat } from '../lib/forecast-edit-calc'
import { sortForecastRows, useForecastSort } from '../lib/forecast-sort'
import type { ForecastFlatN7Row } from '../lib/forecast-flat-n7'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN7FlatRow } from './forecast-n7-flat-row'
import { ForecastPlanRow } from './forecast-plan-row'
import { ForecastTableFooter } from './forecast-table-footer'

interface ForecastN7FlatTableProps {
  roundId: string
  rows: ForecastFlatN7Row[]
  cutoff: number
}

/** Tabla del tab "Forecast N7" — todas las líneas N7 de todos los servicios en una sola tabla plana,
 * cada una con su fila de Plan debajo (F: fila fija de Plan). */
export function ForecastN7FlatTable({ roundId, rows, cutoff }: ForecastN7FlatTableProps) {
  const { col, dir, onSort } = useForecastSort(`${roundId}-n7-flat`)
  const sortedRows = useMemo(
    () => sortForecastRows(rows, col, dir, (r) => r.n7.n7Nombre, (r) => calcN7Totals(r.n4Codigo, r.n7, cutoff)),
    [rows, col, dir, cutoff],
  )

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin PEPs N7 para mostrar" text="Este forecast no tiene líneas N7 habilitadas." />
      </div>
    )
  }

  const monthTotals = monthKeys.map((k) => rows.reduce((s, r) => s + (r.n7.meses[k] || 0), 0))
  const grandTotals = sumN7TotalsFlat(rows, cutoff)

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <ForecastTableHeader cutoff={cutoff} identityLabel="PEP N7 · Servicio N4" sortCol={col} sortDir={dir} onSort={onSort} />
        <tbody>
          {sortedRows.map((r) => (
            <Fragment key={r.n7.n7Codigo}>
              <ForecastN7FlatRow roundId={roundId} row={r} cutoff={cutoff} />
              <ForecastPlanRow plan={findPlanN7(r.n4Codigo, r.n7.n7Codigo)} cutoff={cutoff} />
            </Fragment>
          ))}
        </tbody>
        <ForecastTableFooter rowCount={rows.length} itemLabel="PEPs N7" cutoff={cutoff} monthTotals={monthTotals} grandTotals={grandTotals} />
      </table>
    </div>
  )
}
