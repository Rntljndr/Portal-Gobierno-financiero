import { useState } from 'react'
import { Breadcrumb, Button, Icon, PageHeader } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastMesNota, ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import { useRole } from '@/shared/context/use-role'
import type { useForecastSeleccion } from '../lib/use-forecast-seleccion'
import type { useForecastN7EditarUi } from '../lib/use-forecast-n7-editar-ui'
import type { useForecastColapso } from '../lib/use-forecast-colapso'
import { headcountTotalPorMes, type useForecastHeadcount } from '../lib/forecast-headcount'
import type { useForecastFilters } from '../lib/use-forecast-filters'
import type { ForecastEnvioTransicion } from '../lib/forecast-envio'
import { forecastTablaComparativaCount } from '../lib/forecast-tabla-comparativa'
import { calcN4Meses, calcN4Totals, findPlanN4 } from '../lib/forecast-edit-calc'
import { downloadForecastN7Xlsx } from '../lib/download-forecast-xlsx'
import { ForecastN4InfoCard } from './forecast-n4-info-card'
import { ForecastN4ResumenCard } from './forecast-n4-resumen-card'
import { ForecastEditarMontosModal } from './forecast-editar-montos-modal'
import { ForecastN7Table } from './forecast-n7-table'
import { ForecastHeadcountTable } from './forecast-headcount-table'
import { ForecastChartSection } from './forecast-chart-section'
import { ForecastHeadcountChart } from './forecast-headcount-chart'
import { ForecastTasasDrawer } from './forecast-tasas-drawer'
import { ForecastCompararButton } from './forecast-comparar-button'
import { ForecastColumnasButton } from './forecast-columnas-button'
import { ForecastEnviarCdgBar } from './forecast-enviar-cdg-bar'
import { ForecastListFilters } from './forecast-list-filters'
import { ForecastPeriodoBanner } from './forecast-periodo-banner'
import { ForecastConfigCerrarButtons } from './forecast-config-cerrar-buttons'

type ForecastN7EditarUi = ReturnType<typeof useForecastN7EditarUi>

interface TopSectionProps {
  round: ForecastRound
  n4: ForecastN4Linea
  n4Nombre: string
  n4Codigo: string
  pais: string
  equipo: string
  cutoff: number
  readOnly: boolean
  ui: ForecastN7EditarUi
  onOpenConfiguraciones: () => void
}

/** Breadcrumb + header del servicio N4 + franja de periodo de edición + ficha de identidad del
 * servicio — extraído para mantener ForecastEditarN7Page bajo el límite de líneas del linter. F: "el
 * título del servicio debe estar siempre en la misma ubicación, los botones de configuración y cerrar
 * forecast también... que en la pantalla principal de forecast. Luego viene la card verde... luego el
 * detalle de servicio" — mismo orden que ForecastListPage (header fijo con título+botones, después
 * todo lo demás). F: "al ingresar a un Servicio N4... eliminar la card de forecast activo" — ya no se
 * muestra acá (antes iba después de la ficha de identidad del N4). Sin crumb de round.titulo (F: "la
 * ruta es desde el N4 y entrar a ver los N7", no hay una pantalla intermedia — mismo patrón que
 * Reales/Preliminares, que van directo de su módulo al N4). */
export function ForecastN7EditarTopSection({ round, n4, n4Nombre, n4Codigo, pais, equipo, cutoff, readOnly, ui, onOpenConfiguraciones }: TopSectionProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const esActivo = round.estado === 'Abierto'
  const [bannerVisible, setBannerVisible] = useState(true)
  const [tasasOpen, setTasasOpen] = useState(false)

  return (
    <>
      <Breadcrumb
        items={
          readOnly
            ? [{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: 'Forecasts Anteriores', to: '/forecast' }, { label: n4Nombre }]
            : [{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: n4Nombre }]
        }
      />
      <PageHeader
        title={n4Nombre}
        subtitle={readOnly ? `${n4Codigo} · Servicios N7 · Solo lectura` : `${n4Codigo} · Edición por PEP N7`}
        action={
          <>
            {/* F: "agregar el botón de tasa de cambio al lado izquierdo de configuraciones" — a
             * diferencia de Configuraciones/Cerrar (solo CdG, solo forecast activo), este queda
             * siempre visible (A1: "visible para todos los usuarios y en todos los forecast"). */}
            <Button variant="outline" size="sm" onClick={() => setTasasOpen(true)}>
              Ver tasa de cambio
            </Button>
            {!readOnly && isCdG && esActivo && <ForecastConfigCerrarButtons onOpenConfiguraciones={onOpenConfiguraciones} onCerrar={() => ui.setCloseTarget(round)} />}
          </>
        }
      />
      {esActivo && !readOnly && bannerVisible && (
        <ForecastPeriodoBanner fechaTermino={round.fechaTermino} horaTermino={round.horaTermino} onDismiss={() => setBannerVisible(false)} />
      )}
      <ForecastN4InfoCard n4Codigo={n4Codigo} n4Nombre={n4Nombre} pais={pais} equipo={equipo} />
      <ForecastN4ResumenCard n4={n4} cutoff={cutoff} />
      <ForecastTasasDrawer open={tasasOpen} onClose={() => setTasasOpen(false)} round={round} />
    </>
  )
}

interface TablaSectionProps {
  round: ForecastRound
  n4: ForecastN4Linea
  n4Codigo: string
  n4Nombre: string
  rows: ForecastN7Linea[]
  cutoff: number
  n4Notas: Record<string, ForecastMesNota>
  desvioMaximo: number
  onResetLlave?: (n7Codigo: string) => void
  readOnly: boolean
  seleccion: ReturnType<typeof useForecastSeleccion>
  mostrarSeleccion: boolean
  ui: ForecastN7EditarUi
  anteriorRound: ForecastRound | undefined
  onAplicarTransicion: (transicion: ForecastEnvioTransicion) => void
  colapso: ReturnType<typeof useForecastColapso>
  /** F: "agregar el botón de filtros N7, este botón debe estar sobre el título de Detalle forecast -
   * Servicios N7". */
  filtros: ReturnType<typeof useForecastFilters>
  /** Tabla de Headcount (M4, ejemplo de servicio de rubro nómina) — undefined si este N4 no es de ese
   * rubro, va bajo la tabla de PEP N7. */
  headcount?: ReturnType<typeof useForecastHeadcount>
  readOnlyHeadcount?: boolean
}

/** Filtros N7 + título/Descargar/Comparar + tabla de PEP N7 + tabla de Headcount (si el servicio es de
 * rubro nómina) + "Enviar a Control de Gestión" bajo la tabla — extraído por el mismo motivo que
 * ForecastN7EditarTopSection (que ahora incluye la ficha de identidad del N4, ver F arriba). Orden de
 * botones igual al de Reales: Contraer/Expandir todo — Columnas — Descargar — Comparar — Seleccionar
 * todo (no hay "Edición masiva" en esta pantalla: la carga masiva opera sobre todo el forecast, no
 * sobre un N4 puntual). */
export function ForecastN7EditarTablaSection({ round, n4, n4Codigo, n4Nombre, rows, cutoff, n4Notas, desvioMaximo, onResetLlave, readOnly, seleccion, mostrarSeleccion, ui, anteriorRound, onAplicarTransicion, colapso, filtros, headcount, readOnlyHeadcount }: TablaSectionProps) {
  const colapsoKeys = rows.map((n7) => n7.n7Codigo)
  const hayComparativa = ui.comparativa.plan || !!anteriorRound
  const [editarMontosOpen, setEditarMontosOpen] = useState(false)

  return (
    <>
      <ForecastListFilters roundMostrado={round} isN7 filtros={filtros} />

      <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[13px] font-bold text-foreground">Detalle forecast - Servicios N7</div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* F: "al entrar en editar montos debe cambiar a asignar montos" — mismo drawer
           * (ForecastEditarMontosModal) que la columna Acciones de la tabla N4. */}
          {!readOnly && (
            <Button variant="outline" size="sm" onClick={() => setEditarMontosOpen(true)}>
              <Icon name="edit" size={12} color="#0047B0" /> Asignar Montos
            </Button>
          )}
          {mostrarSeleccion && (
            <Button variant="outline" size="sm" onClick={seleccion.toggleAll}>
              <Icon name={seleccion.allSelected ? 'minus' : 'check'} size={12} color="#0047B0" />
              {seleccion.allSelected ? 'Deseleccionar todo' : 'Seleccionar todos'}
            </Button>
          )}
          {hayComparativa && colapsoKeys.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => colapso.toggleAll(colapsoKeys)}>
              <Icon name={colapso.allCollapsed(colapsoKeys) ? 'chevron_down' : 'chevron_up'} size={12} color="#0047B0" />
              {colapso.allCollapsed(colapsoKeys) ? 'Expandir todo' : 'Contraer todo'}
            </Button>
          )}
          <ForecastColumnasButton variant="n7" visibleCols={ui.visibleColsN7} onChange={ui.setVisibleColsN7} />
          <Button variant="outline" size="sm" onClick={() => downloadForecastN7Xlsx(n4Codigo, n4Nombre, rows, cutoff)}>
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
          {/* F: "cuando se selecciona otro forecast, el botón de comparar debe desaparecer para esta vista" */}
          {!readOnly && <ForecastCompararButton count={forecastTablaComparativaCount(ui.comparativa)} onClick={() => ui.setCompararOpen(true)} />}
        </div>
      </div>

      <ForecastN7Table
        roundId={round.id}
        n4Codigo={n4Codigo}
        rows={rows}
        cutoff={cutoff}
        n4Notas={n4Notas}
        desvioMaximo={desvioMaximo}
        onEditarN7={readOnly ? undefined : (n7) => ui.setEditandoN7Codigo(n7.n7Codigo)}
        onResetLlave={onResetLlave}
        readOnly={readOnly}
        seleccion={mostrarSeleccion ? seleccion : undefined}
        comparativa={ui.comparativa}
        anteriorRound={anteriorRound}
        colapso={colapso}
        visibleCols={ui.visibleColsN7}
      />

      {headcount && <ForecastHeadcountTable rows={headcount.rows} onChange={headcount.onChange} readOnly={readOnlyHeadcount} />}

      {mostrarSeleccion && <ForecastEnviarCdgBar count={seleccion.seleccion.size} onAplicar={onAplicarTransicion} />}

      {!readOnly && <ForecastEditarMontosModal open={editarMontosOpen} onClose={() => setEditarMontosOpen(false)} roundId={round.id} n4={n4} cutoff={cutoff} />}
    </>
  )
}

interface ChartsSectionProps {
  n4: ForecastN4Linea
  cutoff: number
  anteriorN4: ForecastN4Linea | undefined
  esNomina: boolean
  headcount: ReturnType<typeof useForecastHeadcount>
}

/** F: "los gráficos... deben estar enfrentados, al lado izquierdo el gráfico de comparativa y al
 * derecho el de headcount. El gráfico de comparativa debe ser igual con los mismos componentes y
 * comportamientos del gráfico que está dentro del drawer de edición" — mismo ForecastChartSection con
 * plan/anterior/totals que usa ForecastN7EditarContent, a nivel N4 en vez de N7. Sin headcount (rubro
 * no nómina), el gráfico de comparativa ocupa el ancho completo. Extraído por el mismo motivo que las
 * demás secciones de este archivo. */
export function ForecastN7EditarChartsSection({ n4, cutoff, anteriorN4, esNomina, headcount }: ChartsSectionProps) {
  return (
    <div className={cn('mx-8 mb-8 grid gap-5', esNomina ? 'grid-cols-2' : 'grid-cols-1')}>
      <ForecastChartSection
        meses={calcN4Meses(n4)}
        cutoff={cutoff}
        plan={findPlanN4(n4.n4Codigo)}
        anterior={anteriorN4 ? calcN4Meses(anteriorN4) : undefined}
        totals={calcN4Totals(n4, cutoff)}
      />
      {esNomina && <ForecastHeadcountChart totalPorMes={headcountTotalPorMes(headcount.rows)} />}
    </div>
  )
}

