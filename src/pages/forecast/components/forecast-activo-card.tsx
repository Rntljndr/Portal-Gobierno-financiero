import { useEffect, useState } from 'react'
import { Badge, Button, Icon } from '@/shared/ui'
import { useToast } from '@/shared/lib/use-toast'
import { useRole } from '@/shared/context/use-role'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from '../lib/use-forecast-store'
import { formatFechaCorta } from '../lib/format-date'
import { EstadoBadge } from './estado-badge'
import { ForecastDatosCard } from './forecast-datos-card'
import { ForecastActivoDatosForm, type ForecastActivoDraft } from './forecast-activo-datos-form'

function toDraft(round: ForecastRound): ForecastActivoDraft {
  return { titulo: round.titulo, descripcion: round.descripcion, fechaInicio: round.fechaInicio, fechaTermino: round.fechaTermino, desvio: String(round.desvio), notificar: round.notificar }
}

interface ForecastActivoCardProps {
  round: ForecastRound | undefined
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
}

/** Barra de ancho completo con la información del último forecast activo (estado "Abierto"), todo en
 * una línea — a lo sumo puede haber uno a la vez (ver forecast-store.tsx#addRound). El chevron para
 * desplegar el detalle vive junto a "Ver tasa de cambio", a la derecha (F); al desplegarlo, el
 * detalle (antes ForecastActivoDetalleInline) crece dentro de este mismo recuadro en vez de abrir uno
 * aparte (F: "se debe desplegar... en un recuadro diferente" → ahora es el mismo). Editable y
 * persistente solo para Control de Gestión (a nivel de prototipo el usuario actual ya es CdG); para el
 * resto es de solo lectura vía ForecastDatosCard. No se edita tipo ni la selección de PEPs acá:
 * cambiarlos después de creado el forecast dejaría inconsistentes las líneas ya generadas. */
export function ForecastActivoCard({ round, detalleOpen, onToggleDetalle, onVerTasas }: ForecastActivoCardProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const { updateRoundDatos } = useForecastStore()
  const { message, showToast } = useToast()
  const [draft, setDraft] = useState<ForecastActivoDraft | null>(() => (round ? toDraft(round) : null))

  useEffect(() => {
    if (round) setDraft(toDraft(round))
  }, [round])

  if (!round || !draft) {
    return (
      <div className="w-full rounded-xl border border-dashed border-border-strong bg-white p-5">
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Activo</div>
        <div className="text-[13px] text-muted-foreground">No hay ningún forecast abierto actualmente.</div>
      </div>
    )
  }

  const guardar = () => {
    updateRoundDatos(round.id, { ...draft, desvio: Number(draft.desvio) || 0 })
    showToast('Cambios guardados.')
  }

  return (
    <div className="w-full rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5">
          <span className="text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Activo</span>
          <span className="text-[15px] font-bold text-foreground">{round.titulo}</span>
          <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
          <Badge variant="primary">{round.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
          <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
            <Icon name="calendar" size={11} color="#8A90A2" /> {formatFechaCorta(round.fechaInicio)} — {formatFechaCorta(round.fechaTermino)}
          </span>
          <span className="text-[11.5px] text-muted-foreground">Desvío máx: {round.desvio}%</span>
          {round.pepsCount !== null && <span className="text-[11.5px] text-muted-foreground">{round.pepsCount} PEPs habilitados</span>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={onVerTasas}>
            Ver tasa de cambio
          </Button>
          <button
            type="button"
            onClick={onToggleDetalle}
            aria-label={detalleOpen ? 'Ocultar detalle' : 'Ver detalle'}
            title={detalleOpen ? 'Ocultar detalle' : 'Ver detalle'}
            className="flex size-8 items-center justify-center rounded-lg border border-border-strong hover:bg-surface-hover"
          >
            <Icon name={detalleOpen ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
          </button>
        </div>
      </div>

      {detalleOpen && (
        <div className="border-t border-border p-5">
          {isCdG ? (
            <ForecastActivoDatosForm draft={draft} onChange={setDraft} onGuardar={guardar} toastMessage={message} />
          ) : (
            <ForecastDatosCard round={round} embedded />
          )}
        </div>
      )}
    </div>
  )
}
