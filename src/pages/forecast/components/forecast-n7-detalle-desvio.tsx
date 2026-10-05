import { Textarea } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { FORECAST_JUSTIFICACION_OPTIONS } from '../lib/use-forecast-editar-n7-detalle'

const label = 'mb-1.5 block text-[11.5px] font-bold tracking-[0.05em] text-cs-gris-oscuro uppercase'
const select = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

interface ForecastN7DetalleDesvioProps {
  justificacion: string
  onChangeJustificacion: (v: string) => void
  comentario: string
  onChangeComentario: (v: string) => void
  readOnly?: boolean
}

/** Justificación de Desvío + Comentarios (F) — al lado del gráfico, bajo la tabla de Forecast. Se
 * guarda con el botón "Guardar" del pie de página (F: "El botón de guardar"), no tiene uno propio. */
export function ForecastN7DetalleDesvio({ justificacion, onChangeJustificacion, comentario, onChangeComentario, readOnly = false }: ForecastN7DetalleDesvioProps) {
  return (
    <div className="h-full rounded-xl border border-border bg-white p-[20px]">
      <div className="mb-4 text-[14px] font-bold text-foreground">Justificación y comentario del desvío</div>
      <div className="mb-4">
        <label className={label}>Justificación de Desvío</label>
        <select value={justificacion} onChange={(e) => onChangeJustificacion(e.target.value)} disabled={readOnly} className={cn(select, readOnly && 'bg-surface-hover text-muted-foreground')}>
          {FORECAST_JUSTIFICACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Comentarios</label>
        <Textarea value={comentario} onChange={(e) => onChangeComentario(e.target.value)} placeholder="Comentarios adicionales..." rows={5} disabled={readOnly} />
      </div>
    </div>
  )
}
