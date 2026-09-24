import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Breadcrumb, Button, EmptyState, Icon, PageHeader } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './lib/use-forecast-store'
import { useForecastEditarN4 } from './lib/use-forecast-editar-n4'
import { useForecastCargaMasiva } from './lib/use-forecast-carga-masiva'
import { downloadForecastN4Xlsx } from './lib/download-forecast-xlsx'
import { ForecastResumenSection } from './components/forecast-resumen-section'
import { ForecastAnterioresDrawer } from './components/forecast-anteriores-drawer'
import { ForecastN4Table } from './components/forecast-n4-table'
import { ForecastTablaHeader } from './components/forecast-tabla-header'
import { ForecastListOverlays } from './components/forecast-list-overlays'
import { ForecastRoundModals } from './components/forecast-round-modals'

export function ForecastListPage() {
  const navigate = useNavigate()
  const { rounds, closeRound, deleteRound } = useForecastStore()
  const [closeTarget, setCloseTarget] = useState<ForecastRound | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ForecastRound | null>(null)
  const [anterioresOpen, setAnterioresOpen] = useState(false)

  const activo = rounds.find((r) => r.estado === 'Abierto')
  const borradores = rounds.filter((r) => r.estado === 'Borrador')
  const anteriores = rounds.filter((r) => r.estado === 'Cerrado')

  const tabla = useForecastEditarN4(activo?.id)
  const cm = useForecastCargaMasiva(activo)

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Ejercicios', to: '/ejercicios' }, { label: 'Forecast' }]} />
      <PageHeader
        title="Forecast"
        subtitle="Gestión de ejercicios de proyección presupuestaria"
        action={
          <div className="flex items-center gap-2.5">
            <Button variant="primary" onClick={() => navigate('/forecast/nuevo')}>
              <Icon name="plus" size={13} color="#fff" /> Nuevo Forecast
            </Button>
            <Button
              variant="outline"
              className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              disabled={!activo}
              onClick={() => activo && setCloseTarget(activo)}
            >
              <Icon name="x_close" size={13} color="#B42318" /> Cerrar Forecast
            </Button>
          </div>
        }
      />

      {rounds.length === 0 ? (
        <div className="mx-8 mb-8">
          <EmptyState icon="calendar" title="No hay ejercicios de forecast registrados" text="Creá el primero para empezar a proyectar el presupuesto." />
        </div>
      ) : (
        <>
          <ForecastResumenSection
            activo={activo}
            borradores={borradores}
            anterioresCount={anteriores.length}
            onOpenAnteriores={() => setAnterioresOpen(true)}
            onRequestClose={setCloseTarget}
            onRequestDelete={setDeleteTarget}
          />

          <ForecastTablaHeader
            activo={activo}
            ocultarCeros={tabla.ocultarCeros}
            onToggleOcultarCeros={tabla.setOcultarCeros}
            onImportar={cm.openDrawer}
            onDescargar={() => activo && downloadForecastN4Xlsx(activo.titulo, tabla.lineasVisibles, tabla.cutoff)}
          />

          {activo ? (
            <ForecastN4Table roundId={activo.id} rows={tabla.lineasVisibles} cutoff={tabla.cutoff} onEditMonth={tabla.openEdit} />
          ) : (
            <div className="mx-8 mb-8">
              <EmptyState icon="search" title="No hay un forecast activo" text="Abrí un nuevo forecast para ver y editar sus servicios acá." />
            </div>
          )}
        </>
      )}

      <ForecastAnterioresDrawer open={anterioresOpen} onClose={() => setAnterioresOpen(false)} rounds={anteriores} />

      {activo && <ForecastListOverlays activo={activo} tabla={tabla} cm={cm} />}

      <ForecastRoundModals
        closeTarget={closeTarget}
        onCloseTarget={setCloseTarget}
        onConfirmClose={closeRound}
        deleteTarget={deleteTarget}
        onDeleteTarget={setDeleteTarget}
        onConfirmDelete={deleteRound}
      />
    </div>
  )
}
