import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon, PageHeader } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './lib/use-forecast-store'
import { ForecastRoundCard } from './components/forecast-round-card'
import { CerrarForecastModal } from './components/cerrar-forecast-modal'
import { EliminarForecastModal } from './components/eliminar-forecast-modal'

export function ForecastListPage() {
  const navigate = useNavigate()
  const { rounds, closeRound, deleteRound } = useForecastStore()
  const [closeTarget, setCloseTarget] = useState<ForecastRound | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ForecastRound | null>(null)

  const activos = rounds.filter((r) => r.estado === 'Abierto' || r.estado === 'Borrador')
  const anteriores = rounds.filter((r) => r.estado === 'Cerrado')

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Ejercicios', to: '/ejercicios' }, { label: 'Forecast' }]} />
      <PageHeader
        title="Forecast"
        subtitle="Gestión de ejercicios de proyección presupuestaria"
        action={
          <Button variant="primary" onClick={() => navigate('/forecast/nuevo')}>
            <Icon name="plus" size={13} color="#fff" /> Nuevo Forecast
          </Button>
        }
      />

      <div className="mx-8 mb-8">
        {rounds.length === 0 && (
          <EmptyState icon="calendar" title="No hay ejercicios de forecast registrados" text="Creá el primero para empezar a proyectar el presupuesto." />
        )}

        {activos.length > 0 && (
          <>
            <div className="mb-2.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecast Activo</div>
            {activos.map((r) => (
              <ForecastRoundCard key={r.id} round={r} onRequestClose={setCloseTarget} onRequestDelete={setDeleteTarget} />
            ))}
          </>
        )}

        {anteriores.length > 0 && (
          <>
            <div className="mt-5 mb-2.5 text-[11px] font-bold tracking-[0.07em] text-muted-foreground uppercase">Forecasts Anteriores</div>
            {anteriores.map((r) => (
              <ForecastRoundCard key={r.id} round={r} onRequestClose={setCloseTarget} onRequestDelete={setDeleteTarget} />
            ))}
          </>
        )}
      </div>

      <CerrarForecastModal
        round={closeTarget}
        onClose={() => setCloseTarget(null)}
        onConfirm={() => {
          if (closeTarget) closeRound(closeTarget.id)
          setCloseTarget(null)
        }}
      />
      <EliminarForecastModal
        round={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteRound(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}
