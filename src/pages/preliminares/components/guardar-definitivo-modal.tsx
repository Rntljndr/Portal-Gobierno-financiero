import { Button, Modal } from '@/shared/ui'

interface GuardarDefinitivoModalProps {
  open: boolean
  count: number
  onClose: () => void
  onConfirm: () => void
}

export function GuardarDefinitivoModal({ open, count, onClose, onConfirm }: GuardarDefinitivoModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Guardar definitivo"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Sí, guardar definitivo
          </Button>
        </>
      }
    >
      <p className="text-[13.5px] leading-relaxed text-cs-gris-oscuro">Estás a punto de guardar a definitivos "{count} PEP"?</p>
    </Modal>
  )
}
