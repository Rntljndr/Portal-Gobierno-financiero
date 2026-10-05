import { Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { ForecastCompararButton } from './forecast-comparar-button'
import { ForecastColumnasButton } from './forecast-columnas-button'

interface ForecastTablaHeaderProps {
  /** Forecast realmente Abierto — controla "Importar" (editar solo tiene sentido en el activo). */
  activo: ForecastRound | undefined
  /** Forecast que se está mostrando (el activo, o el último cerrado como fallback de A4) — controla
   * "Descargar", disponible también viendo un anterior. */
  roundMostrado: ForecastRound | undefined
  tab: 'n4' | 'n7'
  onImportar: () => void
  onDescargar: () => void
  comparativaCount: number
  onComparar: () => void
  /** "Contraer todo"/"Expandir todo" (mismo patrón y orden que Reales) — ausente cuando no hay ninguna
   * comparativa activa (nada que colapsar). */
  colapsoToggle?: { allCollapsed: boolean; onToggleAll: () => void }
  /** Columnas de identidad visibles (botón "Columnas") de la tabla activa. */
  visibleCols: string[]
  onChangeVisibleCols: (cols: string[]) => void
  /** "Seleccionar todos"/"Deseleccionar todo" (M7) — primero del grupo de botones, mismo lugar y
   * estilo que Preliminares (Button outline + ícono check/minus); F: disponible por igual en Forecast
   * N4 y N7, ausente solo en tablas de solo lectura. */
  seleccionarTodo?: { allSelected: boolean; onToggle: () => void }
  /** F: "cuando se selecciona otro forecast, el botón de comparar debe desaparecer para esta vista" —
   * viendo un forecast anterior puntual (ForecastDetailPage), no el activo. */
  ocultarComparar?: boolean
}

/** Header de la sección de servicios en la pantalla principal de Forecast. Orden de botones igual al
 * de Preliminares: Seleccionar todos — Contraer/Expandir todo — Columnas — Descargar — Carga masiva
 * — Comparar. "Enviar a Control de Gestión"/Aprobar/Rechazar ya no viven acá — están en
 * ForecastEnviarCdgBar, bajo la tabla (mismo lugar que en Presupuesto). Extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastTablaHeader({
  activo,
  roundMostrado,
  tab,
  onImportar,
  onDescargar,
  comparativaCount,
  onComparar,
  colapsoToggle,
  visibleCols,
  onChangeVisibleCols,
  seleccionarTodo,
  ocultarComparar,
}: ForecastTablaHeaderProps) {
  return (
    <div className="mx-8 mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-[13px] font-bold text-foreground">{tab === 'n4' ? 'Detalle forecast - Servicios N4' : 'Detalle forecast - Servicios N7'}</div>
      {roundMostrado && (
        <div className="flex flex-wrap items-center gap-2.5">
          {seleccionarTodo && (
            <Button variant="outline" size="sm" onClick={seleccionarTodo.onToggle}>
              <Icon name={seleccionarTodo.allSelected ? 'minus' : 'check'} size={12} color="#0047B0" />
              {seleccionarTodo.allSelected ? 'Deseleccionar todo' : 'Seleccionar todos'}
            </Button>
          )}
          {colapsoToggle && (
            <Button variant="outline" size="sm" onClick={colapsoToggle.onToggleAll}>
              <Icon name={colapsoToggle.allCollapsed ? 'chevron_down' : 'chevron_up'} size={12} color="#0047B0" />
              {colapsoToggle.allCollapsed ? 'Expandir todo' : 'Contraer todo'}
            </Button>
          )}
          <ForecastColumnasButton variant={tab} visibleCols={visibleCols} onChange={onChangeVisibleCols} />
          <Button variant="outline" size="sm" onClick={onDescargar}>
            <Icon name="download" size={12} color="#0047B0" /> Descargar
          </Button>
          {/* F: "el botón de edición masiva debe ser igual al de carga masiva de reales" — mismo ícono
           * y texto que RealesToolbar/RealesDetailToolbar ("upload" + "Carga masiva"), ya coincide con
           * el título del propio drawer (ForecastCargaMasivaDrawer). */}
          {activo && (
            <Button variant="outline" size="sm" onClick={onImportar}>
              <Icon name="upload" size={12} color="#0047B0" /> Carga masiva
            </Button>
          )}
          {!ocultarComparar && <ForecastCompararButton count={comparativaCount} onClick={onComparar} />}
        </div>
      )}
    </div>
  )
}
