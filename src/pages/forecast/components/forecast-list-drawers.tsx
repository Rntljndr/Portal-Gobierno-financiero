import { FORECAST_MES_ACTUAL, type ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import type { useForecastCargaMasiva } from '../lib/use-forecast-carga-masiva'
import type { ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'
import { forecastAnterioresOptions } from '../lib/forecast-comparativa'
import { ForecastAnterioresDrawer } from './forecast-anteriores-drawer'
import { ForecastTasasDrawer } from './forecast-tasas-drawer'
import { ForecastN7EditarDrawer } from './forecast-n7-editar-drawer'
import { ForecastEditarMontosModal } from './forecast-editar-montos-modal'
import { ForecastTablaCompararDrawer } from './forecast-tabla-comparar-drawer'
import { ForecastListOverlays } from './forecast-list-overlays'
import { ForecastRoundModals } from './forecast-round-modals'

interface ForecastListDrawersProps {
  rounds: ForecastRound[]
  activo: ForecastRound | undefined
  roundMostrado: ForecastRound | undefined
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
  closeTarget: ForecastRound | null
  onCloseTarget: (r: ForecastRound | null) => void
  onConfirmClose: (id: string) => void
}

/** Drawers/modales de ForecastListPage — extraído aparte para mantener la página bajo el límite de
 * líneas del linter (mismo patrón que DetailOverlays en forecast-detail-sections.tsx). */
export function ForecastListDrawers({
  rounds,
  activo,
  roundMostrado,
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
  closeTarget,
  onCloseTarget,
  onConfirmClose,
}: ForecastListDrawersProps) {
  return (
    <>
      <ForecastAnterioresDrawer open={anterioresOpen} onClose={onCloseAnteriores} rounds={anteriores} activo={activo} />

      {roundMostrado && <ForecastTasasDrawer open={tasasOpen} onClose={onCloseTasas} round={roundMostrado} />}

      <ForecastTablaCompararDrawer
        open={compararOpen}
        onClose={onCloseComparar}
        opciones={roundMostrado ? forecastAnterioresOptions(rounds, roundMostrado) : []}
        applied={comparativa}
        onApply={onApplyComparativa}
      />

      {activo && (
        <>
          <ForecastListOverlays activo={activo} cm={cm} />
          <ForecastN7EditarDrawer roundId={activo.id} n4Codigo={editandoN7?.n4Codigo} n7Codigo={editandoN7?.n7Codigo ?? null} onClose={onCloseEditarN7} />
          {editandoMontosN4 && (
            <ForecastEditarMontosModal open roundId={activo.id} n4={editandoMontosN4} cutoff={FORECAST_MES_ACTUAL} onClose={onCloseEditarMontosN4} />
          )}
        </>
      )}

      <ForecastRoundModals closeTarget={closeTarget} onCloseTarget={onCloseTarget} onConfirmClose={onConfirmClose} />
    </>
  )
}
