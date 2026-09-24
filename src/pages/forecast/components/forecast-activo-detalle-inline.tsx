import { useEffect, useState } from 'react'
import { Button, Toast } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { useRole } from '@/shared/context/use-role'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from '../lib/use-forecast-store'
import { ForecastDatosCard } from './forecast-datos-card'

const label = 'mb-1.5 block text-[11.5px] font-bold tracking-[0.05em] text-cs-gris-oscuro uppercase'
const input = 'h-10 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary'

interface Draft {
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaTermino: string
  desvio: string
  notificar: boolean
}

function toDraft(round: ForecastRound): Draft {
  return { titulo: round.titulo, descripcion: round.descripcion, fechaInicio: round.fechaInicio, fechaTermino: round.fechaTermino, desvio: String(round.desvio), notificar: round.notificar }
}

interface ForecastActivoDetalleInlineProps {
  round: ForecastRound
}

/** "Ver detalle" del Forecast Activo (F): se ve desplegado directamente en la pantalla, no en un
 * drawer — se colapsa/expande con el botón de la card (ForecastActivoCard). Editable y persistente
 * solo para el rol Control de Gestión (a nivel de prototipo el usuario actual ya es CdG); para el
 * resto es de solo lectura vía ForecastDatosCard. Tasas de Cambio ahora vive aparte, en
 * ForecastTasasDrawer. No se edita tipo ni la selección de PEPs acá: cambiarlos después de creado el
 * forecast dejaría inconsistentes las líneas ya generadas. */
export function ForecastActivoDetalleInline({ round }: ForecastActivoDetalleInlineProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const { updateRoundDatos } = useForecastStore()
  const { message, showToast } = useToast()
  const [draft, setDraft] = useState<Draft>(() => toDraft(round))

  useEffect(() => setDraft(toDraft(round)), [round])

  const guardar = () => {
    updateRoundDatos(round.id, { ...draft, desvio: Number(draft.desvio) || 0 })
    showToast('Cambios guardados.')
  }

  if (!isCdG) return <ForecastDatosCard round={round} />

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white p-[20px]">
      <div className="mb-4 border-b border-border pb-3 text-[13px] font-bold text-foreground">Datos del Forecast</div>
      <div className="mb-4">
        <label className={label}>Título</label>
        <input value={draft.titulo} onChange={(e) => setDraft((d) => ({ ...d, titulo: e.target.value }))} className={input} />
      </div>
      <div className="mb-4">
        <label className={label}>Descripción</label>
        <input value={draft.descripcion} onChange={(e) => setDraft((d) => ({ ...d, descripcion: e.target.value }))} className={input} />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Fecha de inicio</label>
          <input type="date" value={draft.fechaInicio} onChange={(e) => setDraft((d) => ({ ...d, fechaInicio: e.target.value }))} className={input} />
        </div>
        <div>
          <label className={label}>Fecha de término</label>
          <input type="date" value={draft.fechaTermino} onChange={(e) => setDraft((d) => ({ ...d, fechaTermino: e.target.value }))} className={input} />
        </div>
      </div>
      <div className="mb-1">
        <label className={label}>Porcentaje desvío</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={draft.desvio}
            onChange={(e) => setDraft((d) => ({ ...d, desvio: e.target.value }))}
            className={`${input} pr-8`}
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[13px] font-bold text-muted-foreground">%</span>
        </div>
      </div>
      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <input type="checkbox" checked={draft.notificar} onChange={(e) => setDraft((d) => ({ ...d, notificar: e.target.checked }))} className="size-4 accent-primary" />
        <span className="text-[13px] font-medium text-foreground">Notificar usuarios al abrir este forecast</span>
      </label>

      <div className="mt-5 flex justify-end">
        <Button variant="primary" size="sm" onClick={guardar}>
          Guardar cambios
        </Button>
      </div>
      <Toast message={message} />
    </div>
  )
}
