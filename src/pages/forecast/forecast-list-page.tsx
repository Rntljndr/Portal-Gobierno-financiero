import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { useForecastStore } from './lib/use-forecast-store'
import { useForecastEditarN4 } from './lib/use-forecast-editar-n4'
import { useForecastCargaMasiva } from './lib/use-forecast-carga-masiva'
import { downloadForecastN4Xlsx } from './lib/download-forecast-xlsx'
import { buildFlatN7Rows } from './lib/forecast-flat-n7'
import { calcN7Totals } from './lib/forecast-edit-calc'
import { estaEnCero } from './lib/hide-zero-lines'
import { useForecastFilters } from './lib/use-forecast-filters'
import { ForecastListPageHeader } from './components/forecast-list-page-header'
import { ForecastListBody } from './components/forecast-list-body'
import { ForecastListDrawers } from './components/forecast-list-drawers'

export function ForecastListPage() {
  const navigate = useNavigate()
  const { rounds, closeRound, comparativa, setComparativa } = useForecastStore()
  const [closeTarget, setCloseTarget] = useState<ForecastRound | null>(null)
  const [anterioresOpen, setAnterioresOpen] = useState(false)
  const [detalleOpen, setDetalleOpen] = useState(false)
  const [tasasOpen, setTasasOpen] = useState(false)
  const [compararOpen, setCompararOpen] = useState(false)
  const [tab, setTab] = useState<'n4' | 'n7'>('n4')
  // A5: PEP N7 en edición desde el tab plano — abre ForecastN7EditarDrawer sin navegar.
  const [editandoN7, setEditandoN7] = useState<{ n4Codigo: string; n7Codigo: string } | null>(null)
  // F: "a nivel 4... se debe agregar una columna con el botón de editar" — abre la asignación
  // anualizada (ForecastEditarMontosModal) para ese N4, desde la tabla principal.
  const [editandoMontosN4, setEditandoMontosN4] = useState<ForecastN4Linea | null>(null)

  const activo = rounds.find((r) => r.estado === 'Abierto')
  const anteriores = rounds.filter((r) => r.estado === 'Cerrado').sort((a, b) => (a.fechaTermino < b.fechaTermino ? 1 : -1))
  // A4: sin forecast activo, se muestra el último cerrado — la vista nunca queda vacía.
  const roundMostrado = activo ?? anteriores[0]
  const anteriorRoundComparativa = rounds.find((r) => r.id === comparativa.forecastRoundId)

  const tabla = useForecastEditarN4(roundMostrado?.id)
  const cm = useForecastCargaMasiva(activo)

  const flatN7Rows = useMemo(() => {
    const rows = buildFlatN7Rows(roundMostrado?.lineas ?? [])
    return tabla.ocultarCeros ? rows.filter((r) => !estaEnCero(calcN7Totals(r.n4Codigo, r.n7, tabla.cutoff))) : rows
  }, [roundMostrado, tabla.ocultarCeros, tabla.cutoff])

  const filtros = useForecastFilters(tab, tabla.lineasVisibles, flatN7Rows, tabla.cutoff)

  return (
    <div className="h-full overflow-y-auto">
      <ForecastListPageHeader
        tab={tab}
        onTabChange={setTab}
        hasActivo={!!activo}
        onOpenConfiguraciones={() => activo && navigate(`/forecast/${activo.id}/configuraciones`)}
        onCerrar={() => activo && setCloseTarget(activo)}
      />

      <ForecastListBody
        rounds={rounds}
        activo={activo}
        roundMostrado={roundMostrado}
        ultimoCerrado={anteriores[0]}
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
        onDescargar={() => roundMostrado && downloadForecastN4Xlsx(roundMostrado.titulo, filtros.filteredN4, tabla.cutoff)}
        onEditarN7={(n4Codigo, n7) => setEditandoN7({ n4Codigo, n7Codigo: n7.n7Codigo })}
        onEditarMontosN4={setEditandoMontosN4}
        comparativa={comparativa}
        anteriorRound={anteriorRoundComparativa}
        onOpenComparar={() => setCompararOpen(true)}
        ocultarConfigCerrar
      />

      <ForecastListDrawers
        rounds={rounds}
        activo={activo}
        roundMostrado={roundMostrado}
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
        closeTarget={closeTarget}
        onCloseTarget={setCloseTarget}
        onConfirmClose={closeRound}
      />
    </div>
  )
}
