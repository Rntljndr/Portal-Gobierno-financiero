import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, PageHeader, Toast } from '@/shared/ui'
import { useForecastEditarN7Detalle } from './lib/use-forecast-editar-n7-detalle'
import { ForecastN7DetalleDatosCard } from './components/forecast-n7-detalle-datos-card'
import { ForecastN7DetalleTabla } from './components/forecast-n7-detalle-tabla'
import { ForecastDistribuirMontosDrawer } from './components/forecast-distribuir-montos-drawer'
import { ForecastDescartarCambiosModal } from './components/forecast-descartar-cambios-modal'
import { ForecastChartSection } from './components/forecast-chart-section'
import { ForecastN7DetalleDesvio } from './components/forecast-n7-detalle-desvio'
import { useRestoreScroll } from './lib/use-restore-scroll'

/** "Forecast Nivel 7" (F, copiada de GestionOpex QA — ForecastN7Historico "Editar"/nombre del PEP):
 * detalle de edición de un PEP N7 puntual. Los meses restantes del año se editan directo en la Tabla
 * de Forecast (inputs en la fila del mes, no un drawer por celda); "Distribuir Montos" vive dentro de
 * esa misma tabla, al pie (F). "Guardar" aplica todo junto con la Justificación de Desvío/Comentarios.
 * Debajo de la tabla, el gráfico (expandido por defecto, con selector barras/puntos — F) y la
 * Justificación van lado a lado. "Volver" con cambios sin guardar pide confirmación (F). Se llega acá
 * desde "Editar" en Acciones o desde el nombre del servicio, tanto en la tabla de PEPs N7 de un
 * servicio N4 (Forecast N4 > Forecast N7 > Edición) como en el tab "Forecast N7" del listado. */
export function ForecastN7DetallePage() {
  const { id, n4codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN7Detalle(id, n4codigo, n7codigo)
  const scrollRef = useRestoreScroll<HTMLDivElement>(n7codigo ?? '')
  const [confirmVolverOpen, setConfirmVolverOpen] = useState(false)

  if (!s.round || !s.n4 || !s.n7 || !s.identidad) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP N7 no encontrado" text="No existe un PEP N7 con ese código en este servicio." />
      </div>
    )
  }
  const { round, n4, n7 } = s
  const volverHref = `/forecast/${round.id}/editar/${n4.n4Codigo}`

  const guardarYVolver = () => {
    s.guardar()
    navigate(volverHref)
  }

  const pedirVolver = () => {
    if (s.hasChanges) setConfirmVolverOpen(true)
    else navigate(volverHref)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: 'SIP', to: '/' },
            { label: 'Forecast', to: '/forecast' },
            { label: round.titulo, to: `/forecast/${round.id}/editar` },
            { label: n4.n4Nombre, to: volverHref },
            { label: n7.n7Nombre },
          ]}
        />
        <PageHeader title={n7.n7Nombre} subtitle={`${n7.n7Codigo} · Forecast Nivel 7`} />

        <ForecastN7DetalleDatosCard round={round} n4={n4} n7={n7} identidad={s.identidad} />

        <ForecastN7DetalleTabla n7={n7} plan={s.plan} cutoff={s.cutoff} draft={s.draft} onChangeMes={s.setMes} onDistribuir={() => s.setDistribuirOpen(true)} />

        <div className="mx-8 mb-8 grid grid-cols-2 gap-5">
          <ForecastChartSection meses={n7.meses} cutoff={s.cutoff} />
          <ForecastN7DetalleDesvio justificacion={s.justificacion} onChangeJustificacion={s.setJustificacion} comentario={s.comentario} onChangeComentario={s.setComentario} />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border bg-white p-[14px_32px]">
        <Button variant="outline" onClick={pedirVolver}>
          Volver
        </Button>
        <Button variant="primary" onClick={guardarYVolver}>
          Guardar
        </Button>
      </div>

      <ForecastDistribuirMontosDrawer
        open={s.distribuirOpen}
        onClose={() => s.setDistribuirOpen(false)}
        nombre={n7.n7Nombre}
        meses={n7.meses}
        cutoff={s.cutoff}
        onAplicar={s.aplicarDistribucion}
      />

      <ForecastDescartarCambiosModal open={confirmVolverOpen} onCancel={() => setConfirmVolverOpen(false)} onConfirm={() => navigate(volverHref)} />

      <Toast message={s.message} />
    </div>
  )
}
