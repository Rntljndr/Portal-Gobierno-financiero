import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from './icon'
import { cn } from '@/shared/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  subtitle?: string
  wide?: boolean
  closeDisabled?: boolean
  footer?: ReactNode
  children: ReactNode
}

export function Drawer({ open, onClose, title, eyebrow, subtitle, wide, closeDisabled, footer, children }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && !closeDisabled && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9000] bg-cs-azul-oscuro/35 backdrop-blur-[2px]" />
        <Dialog.Content
          onEscapeKeyDown={(e) => closeDisabled && e.preventDefault()}
          onPointerDownOutside={(e) => closeDisabled && e.preventDefault()}
          className={cn(
            'fixed inset-y-0 right-0 z-[9001] flex h-full max-w-[92vw] flex-col bg-white shadow-[0_0_40px_rgba(6,20,148,0.2)]',
            wide ? 'w-[640px]' : 'w-[460px]',
          )}
        >
          <div className="flex items-start justify-between border-b border-border p-[18px_22px]">
            <div>
              {eyebrow && <div className="mb-1 text-[10.5px] font-bold tracking-[0.1em] text-primary uppercase">{eyebrow}</div>}
              <Dialog.Title className="text-[17px] font-bold text-foreground">{title}</Dialog.Title>
              {subtitle && <div className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</div>}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={closeDisabled}
                aria-label="Cerrar"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover disabled:opacity-40"
              >
                <Icon name="x_close" size={16} color="currentColor" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-[20px_22px]">{children}</div>
          {footer && <div className="flex justify-end gap-2.5 border-t border-border p-[14px_22px]">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
