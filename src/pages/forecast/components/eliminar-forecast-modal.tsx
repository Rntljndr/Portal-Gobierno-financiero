import { Button, Modal } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'

interface EliminarForecastModalProps {
  round: ForecastRound | null
  onClose: () => void
  onConfirm: () => void
}

/** Confirmación simple (F: "cancelar y Sí, eliminar, sin tener que hacer ninguna otra acción") — sin
 * el paso previo de escribir "ELIMINAR" que tenía antes. */
export function EliminarForecastModal({ round, onClose, onConfirm }: EliminarForecastModalProps) {
  return (
    <Modal
      open={round !== null}
      onClose={onClose}
      title="Eliminar Forecast"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" className="bg-[#B42318] hover:bg-[#961d14]" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-[10px_14px] text-[12px] leading-relaxed text-[#B42318]">
        Eliminar este forecast es irreversible y puede afectar comparaciones históricas en reportería.
      </div>
      {round && <p className="mt-3 text-[13px] text-cs-gris-oscuro">¿Eliminar "{round.titulo}"?</p>}
    </Modal>
  )
}
