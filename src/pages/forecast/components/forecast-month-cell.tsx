import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'
import { formatNumber } from '@/shared/lib/format'

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
          {formatNumber(value)}
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            <Icon name={disabledReason ? 'alert' : 'lock'} size={10} color="#8A90A2" />
          </span>
        </span>
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
        {formatNumber(value)}
        <span className="opacity-0 transition-opacity group-hover:opacity-100">
          <Icon name="edit" size={10} color="#0047B0" />
        </span>
      </span>
    </td>
  )
}
