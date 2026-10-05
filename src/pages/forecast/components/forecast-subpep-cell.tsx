import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'

interface ForecastSubPepCellProps {
  hasSubPeps: boolean
  onVer?: () => void
  className: string
}

/** Columna fija "SubPEP" de la tabla N7 (F) — mismo patrón que RealesSubPepCell
 * (reales/components/reales-subpep-cell.tsx): un botón "Ver" solo si el PEP N7 tiene SubPEPs. A
 * diferencia de Reales, acá es un <button> propio (no toda la fila) porque el resto de la fila ya tiene
 * sus propios clics (nombre/celdas de mes abren el drawer de edición). */
export function ForecastSubPepCell({ hasSubPeps, onVer, className }: ForecastSubPepCellProps) {
  return (
    <td className={className}>
      {hasSubPeps && (
        <button type="button" onClick={onVer} className={cn('inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-primary hover:underline')}>
          Ver <Icon name="chevron_right" size={10} color="currentColor" />
        </button>
      )}
    </td>
  )
}
