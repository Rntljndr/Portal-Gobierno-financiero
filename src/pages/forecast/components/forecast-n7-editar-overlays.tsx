import type { ForecastRound } from '@/data/forecast'
import type { useForecastN7EditarUi } from '../lib/use-forecast-n7-editar-ui'
import { forecastAnterioresOptions } from '../lib/forecast-comparativa'
import { ForecastTablaCompararDrawer } from './forecast-tabla-comparar-drawer'
import { ForecastRoundModals } from './forecast-round-modals'

interface OverlaysProps {
  round: ForecastRound
  rounds: ForecastRound[]
  ui: ReturnType<typeof useForecastN7EditarUi>
  onConfirmClose: (id: string) => void
}

/** Drawers y modales de ForecastEditarN7Page — extraído aparte (de forecast-n7-editar-sections.tsx,
 * por el límite de líneas del archivo) para mantener la página bajo el límite de líneas del linter. F:
 * "al ingresar a un Servicio N4... eliminar la card de forecast activo" — esa card era la única
 * entrada a "Ver tasa de cambio"/"Otros forecast" en esta pantalla, así que sus drawers
 * (ForecastTasasDrawer, ForecastAnterioresDrawer) también se sacaron de acá; siguen disponibles desde
 * la pantalla principal de Forecast. */
export function ForecastN7EditarOverlays({ round, rounds, ui, onConfirmClose }: OverlaysProps) {
  return (
    <>
      <ForecastTablaCompararDrawer
        open={ui.compararOpen}
        onClose={() => ui.setCompararOpen(false)}
        opciones={forecastAnterioresOptions(rounds, round)}
        applied={ui.comparativa}
        onApply={ui.setComparativa}
      />
      <ForecastRoundModals closeTarget={ui.closeTarget} onCloseTarget={ui.setCloseTarget} onConfirmClose={onConfirmClose} />
    </>
  )
}
