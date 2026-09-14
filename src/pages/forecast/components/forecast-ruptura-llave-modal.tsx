import { Button, Modal } from '@/shared/ui'

interface ForecastRupturaLlaveModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** Alerta previa a confirmar una edición manual de N7 — mismo patrón que los modales de confirmación de pep-n7-modals.tsx. */
export function ForecastRupturaLlaveModal({ open, onCancel, onConfirm }: ForecastRupturaLlaveModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Confirmar edición manual"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirmar edición manual
          </Button>
        </>
      }
    >
      <p className="text-[14px] leading-relaxed text-cs-gris-oscuro">
        Al editar este valor directamente, se desvinculará de la llave de distribución del servicio N4. El valor quedará fijo como edición manual.
      </p>
    </Modal>
  )
}
