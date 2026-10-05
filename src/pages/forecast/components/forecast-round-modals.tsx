import type { ForecastRound } from '@/data/forecast'
import { CerrarForecastModal } from './cerrar-forecast-modal'

interface ForecastRoundModalsProps {
  closeTarget: ForecastRound | null
  onCloseTarget: (round: ForecastRound | null) => void
  onConfirmClose: (id: string) => void
}

/** Modal de cierre de un forecast, compartido por la card Activo y el header de página — extraído
 * aparte para mantener ForecastListPage bajo el límite de líneas del linter. Eliminar un forecast
 * queda fuera de alcance por ahora (pendiente de validar con negocio). */
export function ForecastRoundModals({ closeTarget, onCloseTarget, onConfirmClose }: ForecastRoundModalsProps) {
  return (
    <CerrarForecastModal
      round={closeTarget}
      onClose={() => onCloseTarget(null)}
      onConfirm={() => {
        if (closeTarget) onConfirmClose(closeTarget.id)
        onCloseTarget(null)
      }}
    />
  )
}
