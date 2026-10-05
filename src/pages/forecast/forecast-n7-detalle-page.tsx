import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, EmptyState, PageHeader } from '@/shared/ui'
import { useForecastEditarN7Detalle } from './lib/use-forecast-editar-n7-detalle'
import { ForecastN7EditarContent } from './components/forecast-n7-editar-content'
import { ForecastN7DetalleFooter } from './components/forecast-n7-detalle-footer'
import { ForecastEstadoHistorialTag } from './components/forecast-estado-historial-tag'
import { ForecastHistorialDrawer } from './components/forecast-historial-drawer'
import { useRestoreScroll } from './lib/use-restore-scroll'

/** "Forecast Nivel 7" en pantalla completa — desde A5 esto solo se usa para VER un PEP N7 de un
 * forecast anterior (solo lectura, con breadcrumb/Volver propios); para editar uno del forecast
 * activo ya no se navega acá, se abre ForecastN7EditarDrawer sin salir de la tabla. El cuerpo
 * (ficha + tabla + gráfico + justificación) vive en ForecastN7EditarContent, compartido por ambos. */
export function ForecastN7DetallePage() {
  const { id, n4codigo, n7codigo } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN7Detalle(id, n4codigo, n7codigo)
  const scrollRef = useRestoreScroll<HTMLDivElement>(n7codigo ?? '')
  const [confirmVolverOpen, setConfirmVolverOpen] = useState(false)
  const [historialOpen, setHistorialOpen] = useState(false)

  if (!s.round || !s.n4 || !s.n7 || !s.identidad) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="PEP N7 no encontrado" text="No existe un PEP N7 con ese código en este servicio." />
      </div>
    )
  }
  const { round, n4, n7 } = s
  const readOnly = round.estado === 'Cerrado'
  const volverHref = `/forecast/${round.id}/editar/${n4.n4Codigo}`

  const guardarYVolver = () => {
    s.guardar()
    navigate(volverHref)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Breadcrumb
          items={[
            { label: 'SIP', to: '/' },
            { label: 'Forecast', to: '/forecast' },
            ...(readOnly ? [{ label: 'Forecasts Anteriores', to: '/forecast' }] : []),
            { label: n4.n4Nombre, to: volverHref },
            { label: n7.n7Nombre },
          ]}
        />
        <PageHeader
          title={n7.n7Nombre}
          subtitle={`${n7.n7Codigo} · Forecast Nivel 7${readOnly ? ' · Solo lectura' : ''}`}
          action={<ForecastEstadoHistorialTag n7={n7} onClick={() => setHistorialOpen(true)} />}
        />

        <ForecastN7EditarContent s={s} readOnly={readOnly} />
      </div>

      <ForecastHistorialDrawer round={round} n7={historialOpen ? n7 : undefined} onClose={() => setHistorialOpen(false)} />

      <ForecastN7DetalleFooter
        s={s}
        readOnly={readOnly}
        onVolver={() => navigate(volverHref)}
        onGuardarYVolver={guardarYVolver}
        confirmVolverOpen={confirmVolverOpen}
        onOpenConfirmVolver={() => setConfirmVolverOpen(true)}
        onCloseConfirmVolver={() => setConfirmVolverOpen(false)}
      />
    </div>
  )
}
