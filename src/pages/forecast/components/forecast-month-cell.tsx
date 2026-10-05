import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'
import { formatForecastAmount } from '../lib/format-forecast-amount'

interface ForecastMonthCellProps {
  value: number
  locked: boolean
  manual?: boolean
  /** Deshabilita la celda por una razón distinta a "Real cerrado" (ej. sin N7 automáticos donde distribuir). */
  disabledReason?: string
  positionClassName?: string
  onEdit?: () => void
}

/** Celda de mes de la tabla de edición de Forecast: bloqueada (Real cerrado), editable automática, o editable con edición manual (llave rota). */
export function ForecastMonthCell({ value, locked, manual = false, disabledReason, positionClassName, onEdit }: ForecastMonthCellProps) {
  if (locked || disabledReason) {
    return (
      <td
        title={disabledReason ?? 'Real cerrado — no editable'}
        className={cn('group p-[10px_6px] text-right text-[11.5px] tabular-nums whitespace-nowrap bg-primary/[0.03] text-foreground cursor-not-allowed', positionClassName)}
      >
        <span className="inline-flex items-center justify-end gap-1">
          {formatForecastAmount(value)}
          {/* F: alinear los valores de mes al mismo borde derecho que Plan/Forecast anterior — el
           * ícono no debe ocupar espacio en el layout mientras está oculto (`hidden`, no `opacity-0`). */}
          <span className="hidden items-center group-hover:inline-flex">
            <Icon name={disabledReason ? 'alert' : 'lock'} size={10} color="#8A90A2" />
          </span>
        </span>
      </td>
    )
  }

  // F (Forecast N4): "en los meses de forecast no debe existir una selección para editar" — sin
  // onEdit, la celda queda informativa nomás (sin cursor-pointer, hover ni tooltip de "click para
  // editar"); la edición ahora vive en la columna Acciones (ver ForecastN4AccionesCell).
  if (!onEdit) {
    return (
      <td className={cn('p-[10px_6px] text-right text-[11.5px] tabular-nums whitespace-nowrap text-muted-foreground', manual && 'bg-warning-surface/40', positionClassName)}>
        {formatForecastAmount(value)}
      </td>
    )
  }

  return (
    <td
      onClick={onEdit}
      title={manual ? 'Edición manual — click para editar' : 'Click para editar'}
      className={cn(
        'group p-[10px_6px] text-right text-[11.5px] tabular-nums whitespace-nowrap cursor-pointer text-muted-foreground hover:bg-primary/5 hover:ring-1 hover:ring-inset hover:ring-primary/30',
        manual && 'bg-warning-surface/40',
        positionClassName,
      )}
    >
      <span className="inline-flex items-center justify-end gap-1">
        {formatForecastAmount(value)}
        <span className="hidden items-center group-hover:inline-flex">
          <Icon name="edit" size={10} color="#0047B0" />
        </span>
      </span>
    </td>
  )
}
