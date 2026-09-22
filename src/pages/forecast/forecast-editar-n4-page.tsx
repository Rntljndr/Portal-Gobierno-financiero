import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon, PageHeader, Toast, VolverBar } from '@/shared/ui'
import { useForecastEditarN4 } from './lib/use-forecast-editar-n4'
import { ForecastN4Table } from './components/forecast-n4-table'
import { ForecastEditDrawer } from './components/forecast-edit-drawer'
import { EstadoBadge } from './components/estado-badge'
import { HideZeroToggle } from './components/hide-zero-toggle'
import { downloadForecastN4Xlsx } from './lib/download-forecast-xlsx'
import { useRestoreScroll } from './lib/use-restore-scroll'

export function ForecastEditarN4Page() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN4(id)
  const scrollRef = useRestoreScroll<HTMLDivElement>(id ?? '')

  if (!s.round) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Forecast no encontrado" text="No existe un ejercicio de forecast con ese identificador." />
      </div>
    )
  }
  const round = s.round

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: round.titulo, to: `/forecast/${round.id}` }, { label: 'Editar' }]} />
        <PageHeader
          title={`Editar Forecast — ${round.titulo}`}
          subtitle="Edición mensual por servicio N4. Los meses con Real cerrado no son editables."
          action={
            <div className="flex items-center gap-3">
              <HideZeroToggle checked={s.ocultarCeros} onChange={s.setOcultarCeros} />
              <Button variant="outline" size="sm" onClick={() => downloadForecastN4Xlsx(round.titulo, s.lineasVisibles, s.cutoff)}>
                <Icon name="download" size={12} color="#0047B0" /> Descargar
              </Button>
              <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
            </div>
          }
        />

        <ForecastN4Table roundId={round.id} rows={s.lineasVisibles} cutoff={s.cutoff} onEditMonth={s.openEdit} />
      </div>

      <VolverBar label="Volver al Forecast" onBack={() => navigate(`/forecast/${round.id}`)} />

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
