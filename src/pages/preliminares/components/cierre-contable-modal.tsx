import { Button, Modal } from '@/shared/ui'

interface CierreContableModalProps {
  open: boolean
  mesLabel: string
  onClose: () => void
  onConfirm: () => void
}

export function CierreContableModal({ open, mesLabel, onClose, onConfirm }: CierreContableModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cierre Contable"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" className="bg-[#B42318] hover:bg-[#941d15]" onClick={onConfirm}>
            Sí, confirmar cierre
          </Button>
        </>
      }
    >
      <p className="text-[13.5px] leading-relaxed text-cs-gris-oscuro">
        ¿Confirmas el Cierre Contable de {mesLabel}? Todos los valores marcados como Definitivos serán publicados en el módulo de Reales y serán visibles para todos los usuarios. Esta acción no se
        puede deshacer.
      </p>
    </Modal>
  )
}
