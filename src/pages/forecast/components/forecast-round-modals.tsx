import type { ForecastRound } from '@/data/forecast'
import { CerrarForecastModal } from './cerrar-forecast-modal'
import { EliminarForecastModal } from './eliminar-forecast-modal'

interface ForecastRoundModalsProps {
  closeTarget: ForecastRound | null
  onCloseTarget: (round: ForecastRound | null) => void
  onConfirmClose: (id: string) => void
  deleteTarget: ForecastRound | null
  onDeleteTarget: (round: ForecastRound | null) => void
  onConfirmDelete: (id: string) => void
}

/** Modales de cerrar/eliminar un forecast, compartidos por la card Activo, el listado de Borradores y
 * el drawer de Anteriores — extraído aparte para mantener ForecastListPage bajo el límite de líneas
 * del linter. */
export function ForecastRoundModals({ closeTarget, onCloseTarget, onConfirmClose, deleteTarget, onDeleteTarget, onConfirmDelete }: ForecastRoundModalsProps) {
  return (
    <>
      <CerrarForecastModal
        round={closeTarget}
        onClose={() => onCloseTarget(null)}
        onConfirm={() => {
          if (closeTarget) onConfirmClose(closeTarget.id)
          onCloseTarget(null)
        }}
      />
      <EliminarForecastModal
        round={deleteTarget}
        onClose={() => onDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onConfirmDelete(deleteTarget.id)
          onDeleteTarget(null)
        }}
      />
    </>
  )
}
