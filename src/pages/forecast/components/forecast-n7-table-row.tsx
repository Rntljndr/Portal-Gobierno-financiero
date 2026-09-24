import { cn } from '@/shared/lib/utils'
import { Badge, Icon } from '@/shared/ui'
import { monthKeys, monthLabels } from '@/data/reporteria'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { calcN7Totals } from '../lib/forecast-edit-calc'
import { n7Identidad } from '../lib/forecast-identidad'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { ForecastResumenCells } from './forecast-resumen-cells'
import { ForecastIdentityCells } from './forecast-identity-cells'
import { ForecastN7TailExtraCells } from './forecast-n7-tail-extra'
import { ForecastMonthCell } from './forecast-month-cell'

const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

function positionClass(closed: boolean, i: number, cutoff: number) {
  return cn(i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'), i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastN7TableRowProps {
  n4Codigo: string
  n7: ForecastN7Linea
  siblings: ForecastN7Linea[]
  cutoff: number
  onEditMonth: (n7: ForecastN7Linea, monthKey: string, monthLabel: string, currentValue: number) => void
  onResetLlave: (n7Codigo: string) => void
}

export function ForecastN7TableRow({ n4Codigo, n7, siblings, cutoff, onEditMonth, onResetLlave }: ForecastN7TableRowProps) {
  const totals = calcN7Totals(n4Codigo, n7, cutoff)
  const isManual = n7.tipoActualizacion === 'manual'
  const identidad = n7Identidad(n4Codigo, n7, siblings, cutoff)

  return (
    <tr className="border-t border-border">
      <td className={cn(td, 'sticky left-0 z-[1] bg-white font-semibold text-foreground')}>
        <div className="flex flex-wrap items-center gap-2">
          <span>{n7.n7Nombre}</span>
          {isManual && (
            <Badge variant="warning">
              <Icon name="alert" size={9} color="currentColor" /> Edición manual
            </Badge>
          )}
        </div>
      </td>
      <ForecastIdentityCells identidad={identidad} />
      {monthKeys.map((k, i) => {
        const closed = i < cutoff
        return (
          <ForecastMonthCell
            key={k}
            value={n7.meses[k] || 0}
            locked={closed}
            manual={isManual && !closed}
            positionClassName={positionClass(closed, i, cutoff)}
            onEdit={closed ? undefined : () => onEditMonth(n7, k, monthLabels[i], n7.meses[k] || 0)}
          />
        )
      })}
      <ForecastResumenCells totals={totals} fmt={formatForecastAmount} />
      <ForecastN7TailExtraCells motivo={identidad.motivo} ultimaEdicion={identidad.ultimaEdicion} onResetLlave={isManual ? () => onResetLlave(n7.n7Codigo) : undefined} />
    </tr>
  )
}
