import { Fragment, useMemo } from 'react'
import { EmptyState } from '@/shared/ui'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { calcN7Totals, findPlanN7, sumN7Totals } from '../lib/forecast-edit-calc'
import { sortForecastRows, useForecastSort } from '../lib/forecast-sort'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN7TableRow } from './forecast-n7-table-row'
import { ForecastPlanRow } from './forecast-plan-row'
import { ForecastTableFooter } from './forecast-table-footer'

interface ForecastN7TableProps {
  roundId: string
  n4Codigo: string
  rows: ForecastN7Linea[]
  cutoff: number
  onEditMonth: (n7: ForecastN7Linea, monthKey: string, monthLabel: string, currentValue: number) => void
  onResetLlave: (n7Codigo: string) => void
  /** Hermanos reales para el cálculo de Llave de Distribución Forecast (forecast-llave.ts) — por
   * defecto son las mismas `rows` que se renderizan, pero ForecastN7DetallePage muestra una sola fila
   * y necesita pasar los hermanos completos del N4 para que la llave no dé 100% por estar sola. */
  siblings?: ForecastN7Linea[]
}

export function ForecastN7Table({ roundId, n4Codigo, rows, cutoff, onEditMonth, onResetLlave, siblings }: ForecastN7TableProps) {
  const { col, dir, onSort } = useForecastSort(n4Codigo)
  const sortedRows = useMemo(
    () => sortForecastRows(rows, col, dir, (n7) => n7.n7Nombre, (n7) => calcN7Totals(n4Codigo, n7, cutoff)),
    [rows, col, dir, n4Codigo, cutoff],
  )

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="search" title="Sin PEPs N7 para mostrar" text="Este servicio no tiene PEPs N7 asociados." />
      </div>
    )
  }

  const monthTotals = monthKeys.map((k) => rows.reduce((s, n7) => s + (n7.meses[k] || 0), 0))
  const grandTotals = sumN7Totals(n4Codigo, rows, cutoff)

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border shadow-[0_1px_4px_rgba(0,20,60,0.06)]">
      <table className="w-full border-collapse text-xs">
        <ForecastTableHeader cutoff={cutoff} identityLabel="PEP N7" variant="n7" sortCol={col} sortDir={dir} onSort={onSort} />
        <tbody>
          {sortedRows.map((n7) => (
            <Fragment key={n7.n7Codigo}>
              <ForecastN7TableRow roundId={roundId} n4Codigo={n4Codigo} n7={n7} siblings={siblings ?? rows} cutoff={cutoff} onEditMonth={onEditMonth} onResetLlave={onResetLlave} />
              <ForecastPlanRow plan={findPlanN7(n4Codigo, n7.n7Codigo)} cutoff={cutoff} variant="n7" />
            </Fragment>
          ))}
        </tbody>
        <ForecastTableFooter rowCount={rows.length} itemLabel="PEPs N7" cutoff={cutoff} variant="n7" monthTotals={monthTotals} grandTotals={grandTotals} />
      </table>
    </div>
  )
}
