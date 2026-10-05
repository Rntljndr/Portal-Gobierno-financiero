import { useState } from 'react'
import { Link } from 'react-router'
import { Button, Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import type { ForecastDesvioIndicador } from '../lib/forecast-desvio-indicador'
import { ForecastJustificacionDrawer } from './forecast-justificacion-drawer'

const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'
const td = 'p-[10px_8px] text-[12px] whitespace-nowrap text-cs-gris-oscuro'

const N7_TAIL_EXTRA_LABELS = ['Desvío', 'Justificación', 'Última Edición', 'Edición']

/** Desvío / Justificación / Última Edición / Edición (F/M5) — solo existen en ForecastN7Historico, no
 * en el de N4. "Desvío" y "Justificación" son dos columnas Sí/No separadas (antes un solo indicador
 * categórico "Sin desvío / justificado / sin justificar") — nunca el texto del motivo, que M5 pide no
 * mostrar en la tabla. Texto plano en vez de Badge (F: "no ser tan protagonistas"): solo un color de
 * texto marca la señal, sin fondo ni borde.
 * F: "cuando ingresas de un N4 a un N7 la columna de acciones también debe ser la columna de edición" —
 * mismo contenido (link/ícono de editar), la columna "Acciones" pasa a llamarse "Edición" (igual
 * criterio que ForecastN4AccionesHeaderCell, que ya cambió "Acciones" por "Editar" a nivel N4). */
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
  /** F: "el dato 'Sí' [de Justificación] debe ser seleccionable para abrir el drawer de ver la
   * justificación" — fuente del detalle mes a mes que muestra ForecastJustificacionDrawer. */
  n7: ForecastN7Linea
  desvioIndicador: ForecastDesvioIndicador
  ultimaEdicion: string
  /** Ruta a ForecastN7DetallePage — "Ver detalle" en Acciones lleva a la tabla de meses restantes del
   * año con todo el detalle del PEP N7. Solo se usa en modo solo lectura (forecast anterior);
   * `undefined` en ForecastN7DetallePage mismo (no tiene sentido linkear a la página en la que ya estás)
   * y también en el forecast activo, donde la edición se abre con `onEditar` en vez de navegar. */
  editHref?: string
  /** F: ícono de lápiz en Acciones que abre el mismo drawer de edición completa que el nombre del
   * servicio — ausente en modo solo lectura (ahí se usa `editHref`) o en ForecastN7DetallePage. */
  onEditar?: () => void
  /** Solo hay algo más que hacer acá cuando la línea está en edición manual (restablecer la llave
   * automática). */
  onResetLlave?: () => void
  /** Forecast anterior (F): el link a ForecastN7DetallePage se mantiene (esa pantalla se adapta sola),
   * pero se etiqueta "Ver detalle" en vez de "Editar" para no sugerir una acción de edición. */
  readOnly?: boolean
}

export function ForecastN7TailExtraCells({ n7, desvioIndicador, ultimaEdicion, editHref, onEditar, onResetLlave, readOnly = false }: ForecastN7TailExtraCellsProps) {
  const [justificacionOpen, setJustificacionOpen] = useState(false)
  const hayDesvio = desvioIndicador !== 'sin-desvio'
  const sinAcciones = !editHref && !onEditar && !onResetLlave

  return (
    <>
      <td className={cn(td, hayDesvio ? 'text-destructive' : 'text-muted-foreground')}>{hayDesvio ? 'Sí' : 'No'}</td>
      <td className={cn(td, hayDesvio ? (desvioIndicador === 'justificado' ? 'text-success' : 'text-destructive') : 'text-muted-foreground')}>
        {hayDesvio && desvioIndicador === 'justificado' ? (
          <button type="button" onClick={() => setJustificacionOpen(true)} className="font-semibold underline-offset-2 hover:underline">
            Sí
          </button>
        ) : hayDesvio ? (
          'No'
        ) : (
          '—'
        )}
      </td>
      <td className={td}>{ultimaEdicion}</td>
      <td className={td}>
        {sinAcciones ? (
          '—'
        ) : (
          <div className="flex items-center gap-2">
            {editHref && (
              <Link to={editHref} className="font-semibold text-primary hover:underline">
                {readOnly ? 'Ver detalle' : 'Editar'}
              </Link>
            )}
            {onEditar && (
              <button type="button" onClick={onEditar} aria-label="Editar" title="Editar" className="text-primary hover:text-[#003685]">
                <Icon name="edit" size={14} color="currentColor" />
              </button>
            )}
            {onResetLlave && (
              <Button variant="outline" size="sm" onClick={onResetLlave}>
                Restablecer llave
              </Button>
            )}
          </div>
        )}
      </td>
      <ForecastJustificacionDrawer n7={justificacionOpen ? n7 : undefined} onClose={() => setJustificacionOpen(false)} />
    </>
  )
}
