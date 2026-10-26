import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon, PageHeader, VolverBar } from '@/shared/ui'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { useForecastEditarN4 } from './lib/use-forecast-editar-n4'
import { EMPTY_TABLA_COMPARATIVA } from './lib/forecast-tabla-comparativa'
import { EMPTY_COLAPSO } from './lib/use-forecast-colapso'
import { ForecastN4Table } from './components/forecast-n4-table'
import { ForecastN7EditarDrawer } from './components/forecast-n7-editar-drawer'
import { EstadoBadge } from './components/estado-badge'
import { HideZeroToggle } from './components/hide-zero-toggle'
import { downloadForecastN4Xlsx } from './lib/download-forecast-xlsx'
import { useRestoreScroll } from './lib/use-restore-scroll'

export function ForecastEditarN4Page() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN4(id)
  const scrollRef = useRestoreScroll<HTMLDivElement>(id ?? '')
  // F: "para editar los datos de forecast en los meses a nivel 4... deben abrir el drawer que se
  // despliega al presionar el botón de editar... al nivel 7" — sin un N7 "representativo" para un N4
  // agregado, se usa el primer PEP N7 hijo (n4.n7[0]) como destino.
  const [editandoN7, setEditandoN7] = useState<{ n4Codigo: string; n7Codigo: string } | null>(null)
  const abrirEditarN4 = (n4: ForecastN4Linea) => n4.n7[0] && setEditandoN7({ n4Codigo: n4.n4Codigo, n7Codigo: n4.n7[0].n7Codigo })

  if (!s.round) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Forecast no encontrado" text="No existe un ejercicio de forecast con ese identificador." />
      </div>
    )
  }
  const round = s.round
  const readOnly = round.estado === 'Cerrado'

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Breadcrumb
          items={
            readOnly
              ? [{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: 'Forecasts Anteriores', to: '/forecast' }, { label: round.titulo }]
              : [{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: round.titulo }]
          }
        />
        <PageHeader
          title={`Editar Forecast — ${round.titulo}`}
          subtitle={readOnly ? 'Servicios N4 de este forecast. Solo lectura.' : 'Edición mensual por servicio N4. Los meses con Real cerrado no son editables.'}
          action={
            <div className="flex items-center gap-3">
              <HideZeroToggle checked={s.ocultarCeros} onChange={s.setOcultarCeros} />
              <Button variant="outline" size="sm" onClick={() => downloadForecastN4Xlsx(round.titulo, s.lineasVisibles, s.cutoff)}>
                <Icon name="download" size={12} color="#0047B0" /> Descargar
              </Button>
              {!readOnly && (
                <Button variant="outline" size="sm" onClick={() => navigate('/reporte-ejercicio-curso?vista=gestion&sub=forecast')}>
                  <Icon name="chart" size={12} color="currentColor" /> Ver en destino
                </Button>
              )}
              <EstadoBadge estado={round.estado} cerradoManual={round.cerradoManual} />
            </div>
          }
        />

        <ForecastN4Table
          roundId={round.id}
          rows={s.lineasVisibles}
          cutoff={s.cutoff}
          onEditar={readOnly ? undefined : abrirEditarN4}
          readOnly={readOnly}
          comparativa={EMPTY_TABLA_COMPARATIVA}
          anteriorRound={undefined}
          colapso={EMPTY_COLAPSO}
        />
      </div>

      <VolverBar label="Volver al Forecast" onBack={() => navigate(`/forecast/${round.id}`)} />

      {!readOnly && <ForecastN7EditarDrawer roundId={round.id} n4Codigo={editandoN7?.n4Codigo} n7Codigo={editandoN7?.n7Codigo ?? null} onClose={() => setEditandoN7(null)} />}
    </div>
  )
}
