import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, EmptyState, PageHeader, Toast, VolverBar } from '@/shared/ui'
import { useForecastEditarN4 } from './lib/use-forecast-editar-n4'
import { ForecastN4Table } from './components/forecast-n4-table'
import { ForecastEditDrawer } from './components/forecast-edit-drawer'
import { EstadoBadge } from './components/estado-badge'

export function ForecastEditarN4Page() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN4(id)

  if (!s.round) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Forecast no encontrado" text="No existe un ejercicio de forecast con ese identificador." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: s.round.titulo, to: `/forecast/${s.round.id}` }, { label: 'Editar' }]} />
        <PageHeader
          title={`Editar Forecast — ${s.round.titulo}`}
          subtitle="Edición mensual por servicio N4. Los meses con Real cerrado no son editables."
          action={<EstadoBadge estado={s.round.estado} cerradoManual={s.round.cerradoManual} />}
        />

        <ForecastN4Table roundId={s.round.id} rows={s.round.lineas} cutoff={s.cutoff} onEditMonth={s.openEdit} />
      </div>

      <VolverBar label="Volver al Forecast" onBack={() => navigate(`/forecast/${s.round?.id}`)} />

      <ForecastEditDrawer
        open={s.editTarget !== null}
        onClose={s.closeEdit}
        level="n4"
        codigo={s.editTarget?.n4.n4Codigo ?? ''}
        nombre={s.editTarget?.n4.n4Nombre ?? ''}
        monthLabel={s.editTarget?.monthLabel ?? ''}
        currentValue={s.editTarget?.currentValue ?? 0}
        llave={s.llave}
        onSubmit={s.submitEdit}
      />

      <Toast message={s.message} />
    </div>
  )
}
