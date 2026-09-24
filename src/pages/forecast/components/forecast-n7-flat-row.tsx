import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { monthKeys } from '@/data/reporteria'
import { calcN7Totals } from '../lib/forecast-edit-calc'
import { n7Identidad } from '../lib/forecast-identidad'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import type { ForecastFlatN7Row } from '../lib/forecast-flat-n7'
import { ForecastResumenCells } from './forecast-resumen-cells'
import { ForecastIdentityCells } from './forecast-identity-cells'
import { ForecastN7TailExtraCells } from './forecast-n7-tail-extra'
import { ForecastMonthCell } from './forecast-month-cell'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function positionClass(closed: boolean, i: number, cutoff: number) {
  return cn(i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'), i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastN7FlatRowProps {
  roundId: string
  row: ForecastFlatN7Row
  cutoff: number
}

/** Fila del tab "Forecast N7" (F: tabs como en Reales) — todas las líneas N7 de todos los servicios,
 * sin scope a un N4 puntual. Solo lectura acá; el link al servicio lleva a la pantalla de edición
 * dedicada (que convive con este tab, sin reemplazarla). */
export function ForecastN7FlatRow({ roundId, row, cutoff }: ForecastN7FlatRowProps) {
  const { n4Codigo, n4Nombre, n7, n4Siblings } = row
  const totals = calcN7Totals(n4Codigo, n7, cutoff)
  const identidad = n7Identidad(n4Codigo, n7, n4Siblings, cutoff)

  return (
    <tr className="border-t border-border">
      <td className={cn(td, 'sticky left-0 z-[1] bg-white font-semibold text-foreground')}>
        <Link to={`/forecast/${roundId}/editar/${encodeURIComponent(n4Codigo)}`} className="block hover:text-primary hover:underline">
          <div>{n7.n7Nombre}</div>
          <div className="text-[10.5px] font-normal text-muted-foreground">{n4Nombre}</div>
        </Link>
      </td>
      <ForecastIdentityCells identidad={identidad} />
      {monthKeys.map((k, i) => {
        const closed = i < cutoff
        return (
          <ForecastMonthCell
            key={k}
            value={n7.meses[k] || 0}
            locked
            positionClassName={positionClass(closed, i, cutoff)}
            disabledReason={closed ? undefined : 'Entrá al servicio para editar'}
          />
        )
      })}
      <ForecastResumenCells totals={totals} fmt={formatForecastAmount} />
      <ForecastN7TailExtraCells motivo={identidad.motivo} ultimaEdicion={identidad.ultimaEdicion} />
    </tr>
  )
}
