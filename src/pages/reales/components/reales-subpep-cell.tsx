import { Icon } from '@/shared/ui'

interface RealesSubPepCellProps {
  hasSubPeps: boolean
  className: string
}

/** Columna fija "SubPEP" de la tabla N7: solo indica con "Ver" que la fila tiene SubPEPs — toda la fila navega al hacer clic. */
export function RealesSubPepCell({ hasSubPeps, className }: RealesSubPepCellProps) {
  return (
    <td className={className}>
      {hasSubPeps && (
        <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-primary">
          Ver <Icon name="chevron_right" size={10} color="currentColor" />
        </span>
      )}
    </td>
  )
}
