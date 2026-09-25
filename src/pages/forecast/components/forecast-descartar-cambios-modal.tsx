import { Button, Modal } from '@/shared/ui'

interface ForecastDescartarCambiosModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** Confirmación al presionar "Volver" habiendo meses editados sin guardar (F). */
export function ForecastDescartarCambiosModal({ open, onCancel, onConfirm }: ForecastDescartarCambiosModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="¿Salir sin guardar?"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" className="bg-[#B42318] hover:bg-[#961d14]" onClick={onConfirm}>
            Sí, salir
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-cs-gris-oscuro">Al salir se perderán todos los cambios realizados. ¿Estás seguro que deseas salir?</p>
    </Modal>
  )
}
