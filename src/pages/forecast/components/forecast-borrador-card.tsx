import { useNavigate } from 'react-router'
import { Badge, Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'
import { EstadoBadge } from './estado-badge'

interface ForecastBorradorCardProps {
  round: ForecastRound | undefined
  onRequestDelete: (round: ForecastRound) => void
}

/** Card del forecast en Borrador — mismo patrón visual que ForecastActivoCard. Un borrador todavía no
 * está abierto, así que "Ver detalle" sigue llevando a la pantalla de edición/creación completa
 * (a diferencia del Activo, que ahora usa un drawer). Conserva la acción de eliminar que antes vivía
 * en ForecastRoundCard (el listado de Borradores que esta card reemplaza). */
export function ForecastBorradorCard({ round, onRequestDelete }: ForecastBorradorCardProps) {
  const navigate = useNavigate()

  if (!round) {
    return (
      <div className="flex-1 rounded-xl border border-dashed border-border-strong bg-white p-5">
        <div className="mb-1.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Borrador</div>
        <div className="text-[13px] text-muted-foreground">No hay ningún forecast en borrador.</div>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-xl border border-border bg-white p-5">
      <div className="mb-1.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Borrador</div>
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
        <Button variant="outline" size="sm" onClick={() => navigate(`/forecast/${round.id}`)}>
          Ver detalle
        </Button>
        <Button variant="outline" size="sm" className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8]" onClick={() => onRequestDelete(round)}>
          <Icon name="trash" size={12} color="#B42318" />
        </Button>
      </div>
    </div>
  )
}
