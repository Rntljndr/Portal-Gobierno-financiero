import { useNavigate, useParams } from 'react-router'
import { EmptyState, Toast, VolverBar } from '@/shared/ui'
import { useForecastEditarN7 } from './lib/use-forecast-editar-n7'
import { findN4EnRound } from './lib/forecast-comparativa'
import { useForecastStore } from './lib/use-forecast-store'
import { useForecastSeleccion } from './lib/use-forecast-seleccion'
import { useForecastColapso } from './lib/use-forecast-colapso'
import { useForecastN7EditarUi } from './lib/use-forecast-n7-editar-ui'
import { esRubroNomina, useForecastHeadcount } from './lib/forecast-headcount'
import { forecastN7Key, type ForecastEnvioTransicion } from './lib/forecast-envio'
import { ForecastN7EditarTopSection, ForecastN7EditarTablaSection, ForecastN7EditarChartsSection } from './components/forecast-n7-editar-sections'
import { ForecastN7EditarOverlays } from './components/forecast-n7-editar-overlays'
import { ForecastN7EditarDrawer } from './components/forecast-n7-editar-drawer'
import { useRestoreScroll } from './lib/use-restore-scroll'

export function ForecastEditarN7Page() {
  const { id, n4codigo } = useParams()
  const navigate = useNavigate()
  const s = useForecastEditarN7(id, n4codigo)
  const { rounds, aplicarTransicionCdG, closeRound } = useForecastStore()
  const scrollRef = useRestoreScroll<HTMLDivElement>(n4codigo ?? '')
  const ui = useForecastN7EditarUi()

  const readOnly = s.round?.estado === 'Cerrado'
  const seleccionables = !readOnly ? s.n7Visibles.filter((n7) => n7.envioEstado !== 'Validado por Control de Gestión').map((n7) => n7.n7Codigo) : []
  const seleccion = useForecastSeleccion(seleccionables)
  const mostrarSeleccion = !readOnly
  const colapso = useForecastColapso()
  const headcount = useForecastHeadcount(s.n7Visibles)

  if (!s.round || !s.n4) {
    return (
      <div className="mx-8 my-8">
        <EmptyState icon="search" title="Servicio no encontrado" text="No existe un servicio N4 con ese código en este forecast." />
      </div>
    )
  }
  const round = s.round
  const n4 = s.n4
  // F: la navegación de un servicio N4 a uno N7 siempre vuelve al forecast unificado (/forecast/:id,
  // con sus tabs N4/N7) — nunca a la pantalla vieja de edición N4 (/forecast/:id/editar).
  const volverHref = `/forecast/${round.id}`
  // F: "cuando se ingresa a un forecast anterior, la única línea a comparar es la de plan" — sin botón
  // "Comparar" acá (ya oculto) para cambiarlo, cualquier "Forecast anterior" elegido mientras se vio el
  // activo no debe arrastrarse a esta vista de solo lectura.
  const anteriorRoundComparativa = readOnly ? undefined : rounds.find((r) => r.id === ui.comparativa.forecastRoundId)
  const anteriorN4 = anteriorRoundComparativa && findN4EnRound(anteriorRoundComparativa, n4.n4Codigo)
  const esNomina = esRubroNomina(n4.n4Codigo)

  const aplicarTransicion = (transicion: ForecastEnvioTransicion) => {
    const claves = new Set([...seleccion.seleccion].map((n7Codigo) => forecastN7Key(n4.n4Codigo, n7Codigo)))
    aplicarTransicionCdG(round.id, transicion, claves)
    seleccion.clear()
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ForecastN7EditarTopSection
          round={round}
          n4={n4}
          n4Nombre={n4.n4Nombre}
          n4Codigo={n4.n4Codigo}
          pais={n4.pais}
          equipo={n4.equipo}
          cutoff={s.cutoff}
          readOnly={readOnly}
          ui={ui}
          onOpenConfiguraciones={() => navigate(`/forecast/${round.id}/configuraciones`)}
        />

        <ForecastN7EditarTablaSection
          round={round}
          n4={n4}
          n4Codigo={n4.n4Codigo}
          n4Nombre={n4.n4Nombre}
          rows={s.n7Visibles}
          cutoff={s.cutoff}
          n4Notas={n4.notas}
          desvioMaximo={round.desvio}
          onResetLlave={readOnly ? undefined : s.onResetLlave}
          readOnly={readOnly}
          seleccion={seleccion}
          mostrarSeleccion={mostrarSeleccion}
          ui={ui}
          anteriorRound={anteriorRoundComparativa}
          onAplicarTransicion={aplicarTransicion}
          colapso={colapso}
          filtros={s.filtros}
          headcount={esNomina ? headcount : undefined}
          readOnlyHeadcount={readOnly}
        />

        <ForecastN7EditarChartsSection n4={n4} cutoff={s.cutoff} anteriorN4={anteriorN4 || undefined} esNomina={esNomina} headcount={headcount} />
      </div>

      <VolverBar label="Volver a Servicios N4" onBack={() => navigate(volverHref)} />

      {!readOnly && <ForecastN7EditarDrawer roundId={round.id} n4Codigo={n4.n4Codigo} n7Codigo={ui.editandoN7Codigo} onClose={() => ui.setEditandoN7Codigo(null)} />}

      <ForecastN7EditarOverlays round={round} rounds={rounds} ui={ui} onConfirmClose={closeRound} />

      <Toast message={s.message} />
    </div>
  )
}
