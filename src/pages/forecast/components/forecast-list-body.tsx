import { EmptyState } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import type { useForecastEditarN4 } from '../lib/use-forecast-editar-n4'
import type { useForecastFilters } from '../lib/use-forecast-filters'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { forecastTablaComparativaCount } from '../lib/forecast-tabla-comparativa'
import { useForecastListSeleccion } from '../lib/use-forecast-seleccion'
import { useForecastListColapso } from '../lib/use-forecast-colapso'
import { useForecastListColumnas } from '../lib/use-forecast-columnas'
import type { ForecastEnvioTransicion } from '../lib/forecast-envio'
import { useForecastStore } from '../lib/use-forecast-store'
import { ForecastResumenSection } from './forecast-resumen-section'
import { ForecastCountrySummaryPanel } from './forecast-country-summary-panel'
import { ForecastListFilters } from './forecast-list-filters'
import { ForecastTablaHeader } from './forecast-tabla-header'
import { EnviarCdgBarSlot } from './forecast-enviar-cdg-bar-slot'
import { ForecastListTablaActiva } from './forecast-list-tabla-activa'

/** Botón "Contraer todo"/"Expandir todo" del header de tabla — solo si hay algo que colapsar. */
function colapsoToggleProp(hayComparativa: boolean, colapso: ReturnType<typeof useForecastListColapso>) {
  if (!hayComparativa || colapso.keys.length === 0) return undefined
  return { allCollapsed: colapso.colapso.allCollapsed(colapso.keys), onToggleAll: () => colapso.colapso.toggleAll(colapso.keys) }
}

interface ListaYTablaProps {
  activo: ForecastRound | undefined
  roundMostrado: ForecastRound | undefined
  tab: 'n4' | 'n7'
  tabla: ReturnType<typeof useForecastEditarN4>
  filtros: ReturnType<typeof useForecastFilters>
  readOnly: boolean
  seleccion: ReturnType<typeof useForecastListSeleccion>
  onEditarN7: (n4Codigo: string, n7: ForecastN7Linea) => void
  onEditarMontosN4: (n4: ForecastN4Linea) => void
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  onOpenComparar: () => void
  onImportar: () => void
  onDescargar: () => void
  colapso: ReturnType<typeof useForecastListColapso>
  columnas: ReturnType<typeof useForecastListColumnas>
  onAplicarTransicion: (roundId: string, transicion: ForecastEnvioTransicion, seleccion: Set<string>) => void
  historico?: boolean
}

/** Header de tabla + tabla activa + barra "Enviar a Control de Gestión" — extraído de ForecastListBody
 * para mantenerlo bajo el límite de líneas del linter. */
function ListaYTabla({ activo, roundMostrado, tab, tabla, filtros, readOnly, seleccion, onEditarN7, onEditarMontosN4, comparativa, anteriorRound, onOpenComparar, onImportar, onDescargar, colapso, columnas, onAplicarTransicion, historico }: ListaYTablaProps) {
  const { mostrarSeleccionN4, mostrarSeleccionN7, seleccionActiva } = seleccion
  const mostrarSeleccion = mostrarSeleccionN4 || mostrarSeleccionN7

  return (
    <>
      <ForecastTablaHeader
        activo={activo}
        roundMostrado={roundMostrado}
        tab={tab}
        onImportar={onImportar}
        onDescargar={onDescargar}
        comparativaCount={forecastTablaComparativaCount(comparativa)}
        onComparar={onOpenComparar}
        colapsoToggle={colapsoToggleProp(comparativa.plan || !!anteriorRound, colapso)}
        visibleCols={columnas.visibleCols}
        onChangeVisibleCols={columnas.setVisibleCols}
        seleccionarTodo={mostrarSeleccion ? { allSelected: seleccionActiva.allSelected, onToggle: seleccionActiva.toggleAll } : undefined}
        ocultarComparar={historico}
      />
      <ForecastListTablaActiva
        roundMostrado={roundMostrado}
        tab={tab}
        tabla={tabla}
        filtros={filtros}
        readOnly={readOnly}
        seleccion={seleccion}
        onEditarN7={onEditarN7}
        onEditarMontosN4={onEditarMontosN4}
        comparativa={comparativa}
        anteriorRound={anteriorRound}
        colapso={colapso.colapso}
        visibleCols={columnas.visibleCols}
      />
      <EnviarCdgBarSlot show={mostrarSeleccion} roundId={roundMostrado?.id} seleccionActiva={seleccionActiva} onAplicar={onAplicarTransicion} />
    </>
  )
}

interface ForecastListBodyProps {
  rounds: ForecastRound[]
  /** Forecast realmente Abierto — controla qué queda editable. */
  activo: ForecastRound | undefined
  /** Forecast que se muestra: el activo, o el último cerrado si no hay ninguno abierto (A4: "la vista
   * nunca queda vacía"). */
  roundMostrado: ForecastRound | undefined
  /** Último forecast cerrado antes del activo (M2: "forecast anterior" del Resumen por País). */
  ultimoCerrado: ForecastRound | undefined
  anterioresCount: number
  tab: 'n4' | 'n7'
  tabla: ReturnType<typeof useForecastEditarN4>
  filtros: ReturnType<typeof useForecastFilters>
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onOpenConfiguraciones: () => void
  onCerrar: () => void
  onImportar: () => void
  onDescargar: () => void
  /** Forecast activo (A5): abre el drawer de edición completa de un PEP N7 desde el tab plano. */
  onEditarN7: (n4Codigo: string, n7: ForecastN7Linea) => void
  /** F: botón de la columna Acciones de la tabla N4 — abre la asignación anualizada para ese N4. */
  onEditarMontosN4: (n4: ForecastN4Linea) => void
  /** Comparativa de tabla (botón "Comparar" del header) y el forecast anterior ya resuelto. */
  comparativa: ForecastTablaComparativa
  anteriorRound: ForecastRound | undefined
  onOpenComparar: () => void
  /** F: viendo un forecast anterior puntual (ForecastDetailPage) en vez del fallback A4 del listado
   * principal — cambia el rótulo/banner de ForecastActivoCard, que de otro modo asumiría "no hay
   * ningún forecast abierto" (no necesariamente cierto: puede haber uno activo en otro lado). */
  historico?: boolean
  /** F: en ForecastListPage, "Configuraciones"/"Cerrar Forecast" se movieron al header (junto a
   * "Nuevo Forecast") — acá quedan ocultos para no duplicarlos. */
  ocultarConfigCerrar?: boolean
}

/** Barra de resumen + filtros (F: "bajo la card del forecast activo") + header de tabla + la tabla N4
 * o N7 activa + la barra "Enviar a Control de Gestión" bajo la tabla — extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListBody({
  rounds,
  activo,
  roundMostrado,
  ultimoCerrado,
  anterioresCount,
  tab,
  tabla,
  filtros,
  detalleOpen,
  onToggleDetalle,
  onVerTasas,
  onOpenAnteriores,
  onOpenConfiguraciones,
  onCerrar,
  onImportar,
  onDescargar,
  onEditarN7,
  onEditarMontosN4,
  comparativa,
  anteriorRound,
  onOpenComparar,
  historico,
  ocultarConfigCerrar,
}: ForecastListBodyProps) {
  const { aplicarTransicionCdG } = useForecastStore()
  const readOnly = !activo
  const seleccion = useForecastListSeleccion(tab, readOnly, filtros)
  const colapso = useForecastListColapso(tab, filtros)
  const columnas = useForecastListColumnas(tab)

  if (rounds.length === 0) {
    return (
      <div className="mx-8 mb-8">
        <EmptyState icon="calendar" title="No hay ejercicios de forecast registrados" text="Creá el primero para empezar a proyectar el presupuesto." />
      </div>
    )
  }

  return (
    <>
      <ForecastResumenSection
        activo={roundMostrado}
        anterioresCount={anterioresCount}
        detalleOpen={detalleOpen}
        onToggleDetalle={onToggleDetalle}
        onVerTasas={onVerTasas}
        onOpenAnteriores={onOpenAnteriores}
        onOpenConfiguraciones={onOpenConfiguraciones}
        onCerrar={onCerrar}
        historico={historico}
        ocultarConfigCerrar={ocultarConfigCerrar}
      />

      {/* F: "el botón de filtro se debe dejar sobre el recuadro azul de resumen de forecast por país" */}
      <ForecastListFilters roundMostrado={roundMostrado} isN7={tab === 'n7'} filtros={filtros} />

      {roundMostrado && <ForecastCountrySummaryPanel activo={roundMostrado} anterior={ultimoCerrado} />}

      <ListaYTabla
        activo={activo}
        roundMostrado={roundMostrado}
        tab={tab}
        tabla={tabla}
        filtros={filtros}
        readOnly={readOnly}
        seleccion={seleccion}
        onEditarN7={onEditarN7}
        onEditarMontosN4={onEditarMontosN4}
        comparativa={comparativa}
        anteriorRound={anteriorRound}
        onOpenComparar={onOpenComparar}
        onImportar={onImportar}
        onDescargar={onDescargar}
        colapso={colapso}
        columnas={columnas}
        onAplicarTransicion={aplicarTransicionCdG}
        historico={historico}
      />
    </>
  )
}
