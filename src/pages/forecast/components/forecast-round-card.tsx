import { useNavigate } from 'react-router'
import { Badge, Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'
import { EstadoBadge } from './estado-badge'

interface ForecastRoundCardProps {
  round: ForecastRound
  onRequestClose: (round: ForecastRound) => void
  onRequestDelete: (round: ForecastRound) => void
}

export function ForecastRoundCard({ round, onRequestClose, onRequestDelete }: ForecastRoundCardProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-2.5 flex items-center gap-4 rounded-xl border border-border bg-white p-[18px_24px]">
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2.5">
          <span className="text-[14px] font-bold text-foreground">{round.titulo}</span>
          <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
          <Badge variant="primary">{round.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
        </div>
        <div className="flex gap-4.5 text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Icon name="calendar" size={11} color="#8A90A2" /> {formatFechaCorta(round.fechaInicio)} — {formatFechaCorta(round.fechaTermino)}
          </span>
          <span>Desvío máx: {round.desvio}%</span>
          {round.pepsCount !== null && <span>{round.pepsCount} PEPs habilitados</span>}
        </div>
      </div>
      <div className="flex gap-2">
        {round.estado === 'Abierto' && (
          <Button variant="outline" size="sm" className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8]" onClick={() => onRequestClose(round)}>
            <Icon name="x_close" size={12} color="#B42318" /> Cerrar Forecast
          </Button>
        )}
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
