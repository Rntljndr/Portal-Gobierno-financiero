import { Textarea } from '@/shared/ui'
import { FORECAST_JUSTIFICACION_OPTIONS } from '../lib/use-forecast-editar-n7-detalle'

const label = 'mb-1.5 block text-[11.5px] font-bold tracking-[0.05em] text-cs-gris-oscuro uppercase'
const select = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

interface ForecastN7DetalleDesvioProps {
  justificacion: string
  onChangeJustificacion: (v: string) => void
  comentario: string
  onChangeComentario: (v: string) => void
}

/** Justificación de Desvío + Comentarios (F) — una sola vez para todo el conjunto de meses editados,
 * no por celda (a diferencia de ForecastEditDrawer). */
export function ForecastN7DetalleDesvio({ justificacion, onChangeJustificacion, comentario, onChangeComentario }: ForecastN7DetalleDesvioProps) {
  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white p-[20px]">
      <div className="mb-4">
        <label className={label}>Justificación de Desvío</label>
        <select value={justificacion} onChange={(e) => onChangeJustificacion(e.target.value)} className={select}>
          {FORECAST_JUSTIFICACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Comentarios</label>
        <Textarea value={comentario} onChange={(e) => onChangeComentario(e.target.value)} placeholder="Comentarios adicionales..." />
      </div>
    </div>
  )
}
