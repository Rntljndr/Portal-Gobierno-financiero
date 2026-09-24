import { Link } from 'react-router'
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
  /** Ruta a ForecastN7DetallePage — "Editar" en Acciones (F) lleva a la tabla de meses restantes del
   * año con todo el detalle del PEP N7, igual que hacer clic en el nombre del servicio. */
  editHref: string
  /** Solo hay algo más que hacer acá cuando la línea está en edición manual (restablecer la llave
   * automática). */
  onResetLlave?: () => void
}

export function ForecastN7TailExtraCells({ motivo, ultimaEdicion, editHref, onResetLlave }: ForecastN7TailExtraCellsProps) {
  return (
    <>
      <td className={td}>{motivo}</td>
      <td className={td}>{ultimaEdicion}</td>
      <td className={td}>
        <div className="flex items-center gap-2">
          <Link to={editHref} className="font-semibold text-primary hover:underline">
            Editar
          </Link>
          {onResetLlave && (
            <Button variant="outline" size="sm" onClick={onResetLlave}>
              Restablecer llave
            </Button>
          )}
        </div>
      </td>
    </>
  )
}
