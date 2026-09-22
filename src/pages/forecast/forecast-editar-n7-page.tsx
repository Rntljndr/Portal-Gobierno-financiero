import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon, PageHeader, Toast, VolverBar } from '@/shared/ui'
import { useForecastEditarN7 } from './lib/use-forecast-editar-n7'
import { ForecastN4InfoCard } from './components/forecast-n4-info-card'
import { ForecastN7Table } from './components/forecast-n7-table'
import { ForecastEditDrawer } from './components/forecast-edit-drawer'
import { ForecastRupturaLlaveModal } from './components/forecast-ruptura-llave-modal'
import { ForecastChartSection } from './components/forecast-chart-section'
import { downloadForecastN7Xlsx } from './lib/download-forecast-xlsx'

export function ForecastEditarN7Page() {
  const { id, n4codigo } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN7(id, n4codigo)

  if (!s.round || !s.n4) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Servicio no encontrado" text="No existe un servicio N4 con ese código en este forecast." />
      </div>
    )
  }
  const round = s.round
  const n4 = s.n4

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: 'SIP', to: '/' },
            { label: 'Forecast', to: '/forecast' },
            { label: round.titulo, to: `/forecast/${round.id}` },
            { label: 'Editar', to: `/forecast/${round.id}/editar` },
            { label: n4.n4Nombre },
          ]}
        />
        <PageHeader
          title={n4.n4Nombre}
          subtitle={`${n4.n4Codigo} · Edición por PEP N7`}
          action={
            <Button variant="outline" size="sm" onClick={() => downloadForecastN7Xlsx(n4.n4Codigo, n4.n4Nombre, n4.n7, s.cutoff)}>
              <Icon name="download" size={12} color="#0047B0" /> Descargar
            </Button>
          }
        />

        <ForecastN4InfoCard n4Codigo={n4.n4Codigo} n4Nombre={n4.n4Nombre} pais={n4.pais} equipo={n4.equipo} />

        <ForecastN7Table n4Codigo={n4.n4Codigo} rows={n4.n7} cutoff={s.cutoff} onEditMonth={s.openEdit} onResetLlave={s.onResetLlave} />

        <ForecastChartSection n4={n4} cutoff={s.cutoff} />
      </div>

      <VolverBar label="Volver a Servicios N4" onBack={() => navigate(`/forecast/${round.id}/editar`)} />

      <ForecastEditDrawer
        open={s.editTarget !== null}
        onClose={s.closeEdit}
        level="n7"
        codigo={s.editTarget?.n7.n7Codigo ?? ''}
        nombre={s.editTarget?.n7.n7Nombre ?? ''}
        monthLabel={s.editTarget?.monthLabel ?? ''}
        currentValue={s.editTarget?.currentValue ?? 0}
        onSubmit={s.onDrawerSubmit}
      />

      <ForecastRupturaLlaveModal open={s.rupturaOpen} onCancel={s.cancelRuptura} onConfirm={s.confirmRuptura} />

      <Toast message={s.message} />
    </div>
  )
}
