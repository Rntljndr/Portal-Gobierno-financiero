import { EmptyState } from '@/shared/ui'
import { monthKeys } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { sumN7Totals } from '../lib/forecast-edit-calc'
import { ForecastTableHeader } from './forecast-table-header'
import { ForecastN7TableRow } from './forecast-n7-table-row'
import { ForecastTableFooter } from './forecast-table-footer'

interface ForecastN7TableProps {
  n4Codigo: string
  rows: ForecastN7Linea[]
  cutoff: number
  onEditMonth: (n7: ForecastN7Linea, monthKey: string, monthLabel: string, currentValue: number) => void
  onResetLlave: (n7Codigo: string) => void
}

export function ForecastN7Table({ n4Codigo, rows, cutoff, onEditMonth, onResetLlave }: ForecastN7TableProps) {
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
        <ForecastTableHeader cutoff={cutoff} identityLabel="PEP N7" />
        <tbody>
          {rows.map((n7) => (
            <ForecastN7TableRow key={n7.n7Codigo} n4Codigo={n4Codigo} n7={n7} cutoff={cutoff} onEditMonth={onEditMonth} onResetLlave={onResetLlave} />
          ))}
        </tbody>
        <ForecastTableFooter rowCount={rows.length} itemLabel="PEPs N7" cutoff={cutoff} monthTotals={monthTotals} grandTotals={grandTotals} />
      </table>
    </div>
  )
}
