import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { Icon, ResumenCells } from '@/shared/ui'
import { monthKeys, monthLabels } from '@/data/reporteria'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { calcN4Meses, calcN4Totals } from '../lib/forecast-edit-calc'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { ForecastMonthCell } from './forecast-month-cell'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function positionClass(closed: boolean, i: number, cutoff: number) {
  return cn(i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'), i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastN4TableRowProps {
  roundId: string
  n4: ForecastN4Linea
  cutoff: number
  onEditMonth: (n4: ForecastN4Linea, monthKey: string, monthLabel: string, currentValue: number) => void
}

export function ForecastN4TableRow({ roundId, n4, cutoff, onEditMonth }: ForecastN4TableRowProps) {
  const meses = calcN4Meses(n4)
  const totals = calcN4Totals(n4, cutoff)
  const hasManual = n4.n7.some((l) => l.tipoActualizacion === 'manual')
  const allManual = n4.n7.length > 0 && n4.n7.every((l) => l.tipoActualizacion === 'manual')

  return (
    <tr className="border-t border-border">
      <td className={cn(td, 'sticky left-0 z-[1] bg-white font-semibold text-foreground')}>
        <Link to={`/forecast/${roundId}/editar/${encodeURIComponent(n4.n4Codigo)}`} className="flex items-center gap-1.5 hover:text-primary hover:underline" title={hasManual ? 'Tiene N7 con edición manual' : undefined}>
          {hasManual && <Icon name="alert" size={11} color="#B45309" />}
          <span>{n4.n4Nombre}</span>
        </Link>
      </td>
      {monthKeys.map((k, i) => {
        const closed = i < cutoff
        return (
          <ForecastMonthCell
            key={k}
            value={meses[k] || 0}
            locked={closed}
            disabledReason={!closed && allManual ? 'Todos los N7 están en edición manual — editá cada N7 o restablecé la llave' : undefined}
            positionClassName={positionClass(closed, i, cutoff)}
            onEdit={closed || allManual ? undefined : () => onEditMonth(n4, k, monthLabels[i], meses[k] || 0)}
          />
        )
      })}
      <ResumenCells totals={totals} fmt={formatForecastAmount} />
    </tr>
  )
}
