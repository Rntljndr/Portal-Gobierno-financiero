import { Badge, Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'
import { EstadoBadge } from './estado-badge'

interface ForecastActivoCardProps {
  round: ForecastRound | undefined
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
}

/** Card con la información del último forecast activo (estado "Abierto") — a lo sumo puede haber uno
 * a la vez (ver forecast-store.tsx#addRound). Sin botón "Editar": la edición vive en la tabla de
 * servicios de la propia pantalla principal, no hace falta un atajo acá. "Ver detalle" despliega/
 * colapsa el detalle directamente en la pantalla (ForecastActivoDetalleInline) en vez de abrir un
 * drawer; "Ver tasa de cambio" abre aparte un drawer ancho solo con la tabla de tasas (F). */
export function ForecastActivoCard({ round, detalleOpen, onToggleDetalle, onVerTasas }: ForecastActivoCardProps) {
  if (!round) {
    return (
      <div className="flex-1 rounded-xl border border-dashed border-border-strong bg-white p-5">
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Activo</div>
        <div className="text-[13px] text-muted-foreground">No hay ningún forecast abierto actualmente.</div>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-xl border border-border bg-white p-5">
      <div className="mb-1.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Activo</div>
      <div className="mb-2 flex flex-wrap items-center gap-2.5">
        <span className="text-[15px] font-bold text-foreground">{round.titulo}</span>
        <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
        <Badge variant="primary">{round.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
      </div>
      <div className="mb-4 flex flex-wrap gap-x-4.5 gap-y-1 text-[11.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Icon name="calendar" size={11} color="#8A90A2" /> {formatFechaCorta(round.fechaInicio)} — {formatFechaCorta(round.fechaTermino)}
        </span>
        <span>Desvío máx: {round.desvio}%</span>
        {round.pepsCount !== null && <span>{round.pepsCount} PEPs habilitados</span>}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onToggleDetalle}>
          {detalleOpen ? 'Ocultar detalle' : 'Ver detalle'}
        </Button>
        <Button variant="outline" size="sm" onClick={onVerTasas}>
          Ver tasa de cambio
        </Button>
      </div>
    </div>
  )
}
