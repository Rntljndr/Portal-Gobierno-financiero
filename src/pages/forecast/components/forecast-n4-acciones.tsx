import { Icon } from '@/shared/ui'

const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'
const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

/** F: "a nivel 4... se debe agregar una columna con el botón de editar que debe ser igual a la [de
 * Acciones en N7]" — mismo patrón que ForecastN7TailExtraCells, acotado al ícono de lápiz (sin
 * Desvío/Justificación/Última Edición, que son conceptos propios de cada PEP N7, no del N4 agregado).
 * F: "la columna a nivel 4 debe ser Editar y no Acciones" — mismo contenido, otro título de columna. */
export function ForecastN4AccionesHeaderCell() {
  return <th className={th}>Editar</th>
}

interface ForecastN4AccionesCellProps {
  /** Abre el modal de "Asignación de monto" (ForecastEditarMontosModal) para este N4 — ausente en
   * tablas de solo lectura (forecast anterior). */
  onEditar?: () => void
}

export function ForecastN4AccionesCell({ onEditar }: ForecastN4AccionesCellProps) {
  return (
    <td className={td}>
      {onEditar ? (
        <button type="button" onClick={onEditar} aria-label="Asignar montos" title="Asignar montos" className="text-primary hover:text-[#003685]">
          <Icon name="edit" size={14} color="currentColor" />
        </button>
      ) : (
        '—'
      )}
    </td>
  )
}
