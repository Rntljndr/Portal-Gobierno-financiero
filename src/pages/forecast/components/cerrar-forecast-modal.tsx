import { Button, Modal } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'

interface CerrarForecastModalProps {
  round: ForecastRound | null
  onClose: () => void
  onConfirm: () => void
}

export function CerrarForecastModal({ round, onClose, onConfirm }: CerrarForecastModalProps) {
  return (
    <Modal
      open={round !== null}
      onClose={onClose}
      title="¿Cerrar el Forecast ahora?"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" className="bg-[#B42318] hover:bg-[#961d14]" onClick={onConfirm}>
            Cerrar Forecast
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-cs-gris-oscuro">
        Al cerrar el forecast antes de su fecha de término (<strong className="text-foreground">{round ? formatFechaCorta(round.fechaTermino) : ''}</strong>), los usuarios ya no podrán editar sus
        líneas. La reportería tomará los datos aprobados a partir de la próxima actualización.
      </p>
    </Modal>
  )
}
