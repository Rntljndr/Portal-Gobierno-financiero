import type { ReactNode } from 'react'
import { Button, Modal } from '@/shared/ui'

interface ConfirmDeleteModalProps {
  open: boolean
  title: string
  onClose: () => void
  onConfirm: () => void
  children: ReactNode
}

export function ConfirmDeleteModal({ open, title, onClose, onConfirm, children }: ConfirmDeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" className="bg-[#dc3545] hover:bg-[#c82333]" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </>
      }
    >
      <p className="text-[14px] leading-relaxed text-cs-gris-oscuro">{children}</p>
    </Modal>
  )
}
