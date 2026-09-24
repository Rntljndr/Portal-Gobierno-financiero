import { useMemo, useState } from 'react'
import { Breadcrumb, PageHeader } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from './lib/use-forecast-store'
import { useForecastEditarN4 } from './lib/use-forecast-editar-n4'
import { useForecastCargaMasiva } from './lib/use-forecast-carga-masiva'
import { downloadForecastN4Xlsx } from './lib/download-forecast-xlsx'
import { buildFlatN7Rows } from './lib/forecast-flat-n7'
import { calcN7Totals } from './lib/forecast-edit-calc'
import { estaEnCero } from './lib/hide-zero-lines'
import { ForecastListHeaderActions } from './components/forecast-list-header-actions'
import { ForecastListBody } from './components/forecast-list-body'
import { ForecastAnterioresDrawer } from './components/forecast-anteriores-drawer'
import { ForecastTasasDrawer } from './components/forecast-tasas-drawer'
import { ForecastListOverlays } from './components/forecast-list-overlays'
import { ForecastRoundModals } from './components/forecast-round-modals'

export function ForecastListPage() {
  const { rounds, closeRound, deleteRound } = useForecastStore()
  const [closeTarget, setCloseTarget] = useState<ForecastRound | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ForecastRound | null>(null)
  const [anterioresOpen, setAnterioresOpen] = useState(false)
  const [detalleOpen, setDetalleOpen] = useState(false)
  const [tasasOpen, setTasasOpen] = useState(false)
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')

  const activo = rounds.find((r) => r.estado === 'Abierto')
  const borrador = rounds.find((r) => r.estado === 'Borrador')
  const anteriores = rounds.filter((r) => r.estado === 'Cerrado')

  const tabla = useForecastEditarN4(activo?.id)
  const cm = useForecastCargaMasiva(activo)

  const flatN7Rows = useMemo(() => {
    const rows = buildFlatN7Rows(activo?.lineas ?? [])
    return tabla.ocultarCeros ? rows.filter((r) => !estaEnCero(calcN7Totals(r.n4Codigo, r.n7, tabla.cutoff))) : rows
  }, [activo, tabla.ocultarCeros, tabla.cutoff])

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb items={[{ label: 'SIP', to: '/' }, { label: 'Presupuesto', to: '/ejercicios' }, { label: 'Ejercicios', to: '/ejercicios' }, { label: 'Forecast' }]} />
      <PageHeader
        title="Forecast"
        subtitle="Gestión de ejercicios de proyección presupuestaria"
        action={<ForecastListHeaderActions activo={activo} tab={tab} onTabChange={setTab} onCerrar={() => activo && setCloseTarget(activo)} />}
      />

      <ForecastListBody
        rounds={rounds}
        activo={activo}
        borrador={borrador}
        anteriores={anteriores}
        tab={tab}
        tabla={tabla}
        flatN7Rows={flatN7Rows}
        detalleOpen={detalleOpen}
        onToggleDetalle={() => setDetalleOpen((v) => !v)}
        onVerTasas={() => setTasasOpen(true)}
        onOpenAnteriores={() => setAnterioresOpen(true)}
        onImportar={cm.openDrawer}
        onDescargar={() => activo && downloadForecastN4Xlsx(activo.titulo, tabla.lineasVisibles, tabla.cutoff)}
      />

      <ForecastAnterioresDrawer open={anterioresOpen} onClose={() => setAnterioresOpen(false)} borrador={borrador} rounds={anteriores} onRequestDelete={setDeleteTarget} />

      {activo && (
        <>
          <ForecastTasasDrawer open={tasasOpen} onClose={() => setTasasOpen(false)} round={activo} />
          <ForecastListOverlays activo={activo} tabla={tabla} cm={cm} />
        </>
      )}

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
