import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon } from '@/shared/ui'
import { useForecastStore } from './lib/use-forecast-store'
import { EstadoBadge } from './components/estado-badge'
import { CerrarForecastModal } from './components/cerrar-forecast-modal'
import { formatFechaCorta } from './lib/format-date'

export function ForecastDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rounds, closeRound } = useForecastStore()
  const round = rounds.find((r) => r.id === id)
  const [showClose, setShowClose] = useState(false)

  if (!round) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Forecast no encontrado" text="No existe un ejercicio de forecast con ese identificador." />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: round.titulo }]} />
      <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
        <div>
          <div className="text-[22px] leading-tight font-bold tracking-tight text-primary">{round.titulo}</div>
          <div className="mt-2 flex items-center gap-2">
            <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
            <span className="text-[12.5px] text-muted-foreground">
              {formatFechaCorta(round.fechaInicio)} — {formatFechaCorta(round.fechaTermino)} · Desvío máx: {round.desvio}%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {round.estado === 'Abierto' && (
            <Button variant="outline" className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8]" onClick={() => setShowClose(true)}>
              <Icon name="x_close" size={13} color="#B42318" /> Cerrar Forecast
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/forecast')}>
            ← Volver
          </Button>
        </div>
      </div>

      <div className="mx-8 mb-8 rounded-xl border border-dashed border-border-strong bg-white p-10 text-center">
        <div className="text-[13px] text-cs-gris-oscuro">Vista de detalle con tabla de líneas presupuestarias</div>
        <div className="mt-2 text-[11.5px] text-muted-foreground">Integración con backend pendiente de coordinación con Control de Gestión</div>
      </div>

      <CerrarForecastModal
        round={showClose ? round : null}
        onClose={() => setShowClose(false)}
        onConfirm={() => {
          closeRound(round.id)
          setShowClose(false)
        }}
      />
    </div>
  )
}
