import { Breadcrumb, PageHeader } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import type { useForecastCargaMasiva } from '../lib/use-forecast-carga-masiva'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { forecastAnterioresOptions } from '../lib/forecast-comparativa'
import { downloadForecastAnteriorXlsx } from '../lib/download-forecast-anterior'
import { ForecastDetailHeaderActions } from './forecast-detail-header-actions'
import { ForecastAnterioresDrawer } from './forecast-anteriores-drawer'
import { ForecastTasasDrawer } from './forecast-tasas-drawer'
import { ForecastN7EditarDrawer } from './forecast-n7-editar-drawer'
import { ForecastEditarMontosModal } from './forecast-editar-montos-modal'
import { ForecastTablaCompararDrawer } from './forecast-tabla-comparar-drawer'
import { ForecastListOverlays } from './forecast-list-overlays'
import { ForecastRoundModals } from './forecast-round-modals'

interface DetailHeaderProps {
  round: ForecastRound
  esAnterior: boolean
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
  onVolver: () => void
}

/** Breadcrumb + PageHeader de ForecastDetailPage — extraído para mantener la página bajo el límite de
 * líneas del linter. Sin botón "Editar Forecast": esta misma página ya ofrece edición inline completa
 * cuando el round sigue Abierto (F: "solo debe pasar de N4 a N7", nunca por la pantalla vieja
 * /forecast/:id/editar). */
export function DetailHeader({ round, esAnterior, tab, onTabChange, onVolver }: DetailHeaderProps) {
  return (
    <>
      <Breadcrumb
        items={
          esAnterior
            ? [{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: 'Forecasts Anteriores', to: '/forecast' }, { label: round.titulo }]
            : [{ label: 'SIP', to: '/' }, { label: 'Forecast', to: '/forecast' }, { label: round.titulo }]
        }
      />
      <PageHeader
        title={round.titulo}
        subtitle="Gestión de ejercicios de proyección presupuestaria"
        action={<ForecastDetailHeaderActions tab={tab} onTabChange={onTabChange} onDescargar={() => downloadForecastAnteriorXlsx(round)} onVolver={onVolver} />}
      />
    </>
  )
}

interface DetailOverlaysProps {
  rounds: ForecastRound[]
  round: ForecastRound
  activo: ForecastRound | undefined
  /** Forecast realmente Abierto (F) — a diferencia de `activo` de arriba (que es `undefined` solo por
   * estar viendo un anterior puntual), este nunca lo es por esa razón. Se usa para la card "Forecast
   * activo" del drawer "Otros forecast", que debe verse igual en todas las vistas (F: "el drawer...
   * debe ser igual en todos lados"). */
  activoReal?: ForecastRound
  anteriores: ForecastRound[]
  anterioresOpen: boolean
  onCloseAnteriores: () => void
  tasasOpen: boolean
  onCloseTasas: () => void
  compararOpen: boolean
  onCloseComparar: () => void
  comparativa: ForecastTablaComparativa
  onApplyComparativa: (c: ForecastTablaComparativa) => void
  cm: ReturnType<typeof useForecastCargaMasiva>
  editandoN7: { n4Codigo: string; n7Codigo: string } | null
  onCloseEditarN7: () => void
  /** F: "a nivel 4... se debe agregar una columna con el botón de editar" — abre la asignación
   * anualizada (ForecastEditarMontosModal) para ese N4. */
  editandoMontosN4: ForecastN4Linea | null
  onCloseEditarMontosN4: () => void
  cutoff: number
  closeTarget: ForecastRound | null
  onCloseTarget: (r: ForecastRound | null) => void
  onConfirmClose: (id: string) => void
}

/** Drawers/modales de ForecastDetailPage — extraído para mantener la página bajo el límite de líneas
 * del linter. */
export function DetailOverlays({
  rounds,
  round,
  activo,
  activoReal,
  anteriores,
  anterioresOpen,
  onCloseAnteriores,
  tasasOpen,
  onCloseTasas,
  compararOpen,
  onCloseComparar,
  comparativa,
  onApplyComparativa,
  cm,
  editandoN7,
  onCloseEditarN7,
  editandoMontosN4,
  onCloseEditarMontosN4,
  cutoff,
  closeTarget,
  onCloseTarget,
  onConfirmClose,
}: DetailOverlaysProps) {
  return (
    <>
      <ForecastAnterioresDrawer open={anterioresOpen} onClose={onCloseAnteriores} rounds={anteriores} activo={activoReal} />
      <ForecastTasasDrawer open={tasasOpen} onClose={onCloseTasas} round={round} />
      <ForecastTablaCompararDrawer
        open={compararOpen}
        onClose={onCloseComparar}
        opciones={forecastAnterioresOptions(rounds, round)}
        applied={comparativa}
        onApply={onApplyComparativa}
      />
      {activo && (
        <>
          <ForecastListOverlays activo={activo} cm={cm} />
          <ForecastN7EditarDrawer roundId={activo.id} n4Codigo={editandoN7?.n4Codigo} n7Codigo={editandoN7?.n7Codigo ?? null} onClose={onCloseEditarN7} />
          {editandoMontosN4 && (
            <ForecastEditarMontosModal open roundId={activo.id} n4={editandoMontosN4} cutoff={cutoff} onClose={onCloseEditarMontosN4} />
          )}
        </>
      )}
      <ForecastRoundModals closeTarget={closeTarget} onCloseTarget={onCloseTarget} onConfirmClose={onConfirmClose} />
    </>
  )
}
