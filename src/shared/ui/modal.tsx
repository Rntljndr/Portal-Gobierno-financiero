import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from './icon'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  width?: number
  closeDisabled?: boolean
  footer?: ReactNode
  children: ReactNode
}

export function Modal({ open, onClose, title, width = 460, closeDisabled, footer, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && !closeDisabled && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9000] bg-cs-azul-oscuro/35 backdrop-blur-[2px]" />
        <Dialog.Content
          onEscapeKeyDown={(e) => closeDisabled && e.preventDefault()}
          onPointerDownOutside={(e) => closeDisabled && e.preventDefault()}
          className="fixed top-1/2 left-1/2 z-[9001] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-[0_24px_64px_rgba(6,20,148,0.24)]"
          style={{ width }}
        >
          <div className="flex items-center justify-between rounded-t-2xl bg-cs-azul p-[16px_20px]">
            <Dialog.Title className="text-[15px] font-bold text-white">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={closeDisabled}
                aria-label="Cerrar"
                className="flex size-7 items-center justify-center rounded-lg hover:bg-white/15 disabled:opacity-40"
              >
                <Icon name="x_close" size={16} color="#fff" />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-5">{children}</div>
          {footer && <div className="flex justify-end gap-2.5 border-t border-border p-[14px_20px]">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
