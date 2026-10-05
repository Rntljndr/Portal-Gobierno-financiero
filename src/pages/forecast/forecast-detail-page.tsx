import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { downloadForecastN4Xlsx } from './lib/download-forecast-xlsx'
import { useForecastDetail } from './lib/use-forecast-detail'
import { ForecastListBody } from './components/forecast-list-body'
import { DetailHeader, DetailOverlays } from './components/forecast-detail-sections'

/** Vista de un forecast puntual — activo (llegando vía "Volver al Forecast" desde las pantallas de
 * edición) o anterior (F: "misma estructura que el forecast, solo que cambia que no puede editar, no
 * tiene configuraciones, no se puede abrir uno nuevo desde allí, no tiene que enviar a control de
 * gestión, no tiene que hacer una edición masiva, las tabs desaparecen") — reutiliza ForecastListBody
 * en vez de una tabla aparte, para que ambas vistas queden siempre alineadas. */
export function ForecastDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [closeTarget, setCloseTarget] = useState<ForecastRound | null>(null)
  const [anterioresOpen, setAnterioresOpen] = useState(false)
  const [detalleOpen, setDetalleOpen] = useState(false)
  const [tasasOpen, setTasasOpen] = useState(false)
  const [compararOpen, setCompararOpen] = useState(false)
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')
  const [editandoN7, setEditandoN7] = useState<{ n4Codigo: string; n7Codigo: string } | null>(null)
  const [editandoMontosN4, setEditandoMontosN4] = useState<ForecastN4Linea | null>(null)

  const { rounds, closeRound, comparativa, setComparativa, round, activo, activoReal, anteriores, anteriorRoundComparativa, tabla, cm, filtros } = useForecastDetail(id, tab)

  if (!round) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Forecast no encontrado" text="No existe un ejercicio de forecast con ese identificador." />
      </div>
    )
  }

  const esAnterior = round.estado === 'Cerrado'
  // F: "cuando se ingresa a un forecast anterior, la única línea a comparar es la de plan" — acá no
  // hay botón "Comparar" (ya oculto, ver ForecastTablaHeader#ocultarComparar) para cambiarlo, así que
  // cualquier "Forecast anterior" elegido mientras se vio el activo no debe arrastrarse a esta vista.
  const comparativaEfectiva = esAnterior ? { plan: true, forecastRoundId: null } : comparativa
  const anteriorRoundEfectivo = esAnterior ? undefined : anteriorRoundComparativa

  return (
    <div className="h-full overflow-y-auto">
      <DetailHeader round={round} esAnterior={esAnterior} tab={tab} onTabChange={setTab} onVolver={() => navigate('/forecast')} />

      <ForecastListBody
        rounds={rounds}
        activo={activo}
        roundMostrado={round}
        ultimoCerrado={undefined}
        anterioresCount={anteriores.length}
        tab={tab}
        tabla={tabla}
        filtros={filtros}
        detalleOpen={detalleOpen}
        onToggleDetalle={() => setDetalleOpen((v) => !v)}
        onVerTasas={() => setTasasOpen(true)}
        onOpenAnteriores={() => setAnterioresOpen(true)}
        onOpenConfiguraciones={() => activo && navigate(`/forecast/${activo.id}/configuraciones`)}
        onCerrar={() => activo && setCloseTarget(activo)}
        onImportar={cm.openDrawer}
        onDescargar={() => downloadForecastN4Xlsx(round.titulo, filtros.filteredN4, tabla.cutoff)}
        onEditarN7={(n4Codigo, n7) => setEditandoN7({ n4Codigo, n7Codigo: n7.n7Codigo })}
        onEditarMontosN4={setEditandoMontosN4}
        comparativa={comparativaEfectiva}
        anteriorRound={anteriorRoundEfectivo}
        onOpenComparar={() => setCompararOpen(true)}
        historico={esAnterior}
      />

      <DetailOverlays
        rounds={rounds}
        round={round}
        activo={activo}
        activoReal={activoReal}
        anteriores={anteriores}
        anterioresOpen={anterioresOpen}
        onCloseAnteriores={() => setAnterioresOpen(false)}
        tasasOpen={tasasOpen}
        onCloseTasas={() => setTasasOpen(false)}
        compararOpen={compararOpen}
        onCloseComparar={() => setCompararOpen(false)}
        comparativa={comparativa}
        onApplyComparativa={setComparativa}
        cm={cm}
        editandoN7={editandoN7}
        onCloseEditarN7={() => setEditandoN7(null)}
        editandoMontosN4={editandoMontosN4}
        onCloseEditarMontosN4={() => setEditandoMontosN4(null)}
        cutoff={tabla.cutoff}
        closeTarget={closeTarget}
        onCloseTarget={setCloseTarget}
        onConfirmClose={closeRound}
      />
    </div>
  )
}
