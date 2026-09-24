import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, PageHeader, Toast } from '@/shared/ui'
import { useForecastEditarN4Detalle } from './lib/use-forecast-editar-n4-detalle'
import { calcN4Meses } from './lib/forecast-edit-calc'
import { ForecastN4DetalleDatosCard } from './components/forecast-n4-detalle-datos-card'
import { ForecastN4Table } from './components/forecast-n4-table'
import { ForecastEditDrawer } from './components/forecast-edit-drawer'
import { ForecastDistribuirMontosDrawer } from './components/forecast-distribuir-montos-drawer'
import { ForecastChartSection } from './components/forecast-chart-section'
import { ForecastN7DetalleDesvio } from './components/forecast-n7-detalle-desvio'
import { useRestoreScroll } from './lib/use-restore-scroll'

/** "Forecast Nivel 4": detalle de edición de un PEP N4 puntual, análogo a ForecastN7DetallePage. La
 * tabla reutiliza ForecastN4Table con una sola fila; editar un mes redistribuye el monto entre los N7
 * hijos según la llave vigente (updateN4Monto), igual que editar desde la tabla de todos los N4.
 * "Ver PEPs N7" lleva a la tabla de PEPs N7 de este servicio (ForecastEditarN7Page, ruta .../n7). Se
 * llega acá desde el nombre del servicio, tanto en la tabla "Servicios N4" del listado como en la
 * pantalla "Editar Forecast" (todos los N4). */
export function ForecastN4DetallePage() {
  const { id, n4codigo } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN4Detalle(id, n4codigo)
  const scrollRef = useRestoreScroll<HTMLDivElement>(n4codigo ?? '')

  if (!s.round || !s.n4 || !s.identidad) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Servicio N4 no encontrado" text="No existe un servicio N4 con ese código en este forecast." />
      </div>
    )
  }
  const { round, n4 } = s
  const volverHref = `/forecast/${round.id}/editar`
  const pepsN7Href = `/forecast/${round.id}/editar/${n4.n4Codigo}/n7`

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: round.titulo, to: volverHref }, { label: n4.n4Nombre }]} />
        <PageHeader
          title={n4.n4Nombre}
          subtitle={`${n4.n4Codigo} · Forecast Nivel 4`}
          action={
            <Button variant="outline" size="sm" onClick={() => navigate(pepsN7Href)}>
              Ver PEPs N7
            </Button>
          }
        />

        <ForecastN4DetalleDatosCard round={round} n4={n4} identidad={s.identidad} />

        <ForecastN4Table roundId={round.id} rows={[n4]} cutoff={s.cutoff} onEditMonth={(_n4, monthKey, monthLabel, currentValue) => s.openEdit(monthKey, monthLabel, currentValue)} hideEditLink />

        <div className="mx-8 mb-5 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => s.setDistribuirOpen(true)}>
            Distribuir Montos
          </Button>
        </div>

        <div className="mx-8 mb-8 grid grid-cols-[1.4fr_1fr] gap-5">
          <ForecastChartSection meses={calcN4Meses(n4)} cutoff={s.cutoff} />
          <ForecastN7DetalleDesvio justificacion={s.justificacion} onChangeJustificacion={s.setJustificacion} comentario={s.comentario} onChangeComentario={s.setComentario} />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border bg-white p-[14px_32px]">
        <Button variant="outline" onClick={() => navigate(volverHref)}>
          Volver
        </Button>
        <Button variant="primary" onClick={s.guardarNota}>
          Guardar
        </Button>
      </div>

      <ForecastEditDrawer
        open={s.editTarget !== null}
        onClose={s.closeEdit}
        level="n4"
        codigo={n4.n4Codigo}
        nombre={n4.n4Nombre}
        monthLabel={s.editTarget?.monthLabel ?? ''}
        currentValue={s.editTarget?.currentValue ?? 0}
        onSubmit={s.submitEdit}
      />

      <ForecastDistribuirMontosDrawer
        open={s.distribuirOpen}
        onClose={() => s.setDistribuirOpen(false)}
        nombre={n4.n4Nombre}
        meses={calcN4Meses(n4)}
        cutoff={s.cutoff}
        onAplicar={s.aplicarDistribucion}
      />

      <Toast message={s.message} />
    </div>
  )
}
