import { Button } from '@/shared/ui'

const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'
const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

const N7_TAIL_EXTRA_LABELS = ['Motivo', 'Última Edición', 'Acciones']

/** Motivo / Última Edición / Acciones (F) — solo existen en ForecastN7Historico, no en el de N4. */
export function ForecastN7TailExtraHeaderCells() {
  return (
    <>
      {N7_TAIL_EXTRA_LABELS.map((label) => (
        <th key={label} className={th}>
          {label}
        </th>
      ))}
    </>
  )
}

interface ForecastN7TailExtraCellsProps {
  motivo: string
  ultimaEdicion: string
  /** Solo hay algo que hacer acá cuando la línea está en edición manual (restablecer la llave
   * automática) — el resto de la edición ya vive en las celdas de mes, no hace falta un botón por fila. */
  onResetLlave?: () => void
}

export function ForecastN7TailExtraCells({ motivo, ultimaEdicion, onResetLlave }: ForecastN7TailExtraCellsProps) {
  return (
    <>
      <td className={td}>{motivo}</td>
      <td className={td}>{ultimaEdicion}</td>
      <td className={td}>
        {onResetLlave ? (
          <Button variant="outline" size="sm" onClick={onResetLlave}>
            Restablecer llave
          </Button>
        ) : (
          '—'
        )}
      </td>
    </>
  )
}
