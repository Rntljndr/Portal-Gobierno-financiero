import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from './icon'
import { cn } from '@/shared/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  /** Contenido extra junto al título, en la misma línea (p.ej. un tag de estado seleccionable). */
  titleExtra?: ReactNode
  eyebrow?: string
  subtitle?: string
  wide?: boolean
  /** Ancho extra (1260px) para contenido que no debe tener scroll lateral, p.ej. la tabla de Tasas de
   * Cambio con sus 12 columnas de mes. Tiene prioridad sobre `wide`. */
  xwide?: boolean
  closeDisabled?: boolean
  footer?: ReactNode
  children: ReactNode
  /** 'dark' replica el header azul oscuro con texto blanco de ciertas pantallas de Presupuesto (p.ej.
   * "Asignación de monto") — default 'light' (header blanco, el de siempre) para no afectar al resto
   * de los drawers que ya usan este componente. */
  headerVariant?: 'light' | 'dark'
}

export function Drawer({ open, onClose, title, titleExtra, eyebrow, subtitle, wide, xwide, closeDisabled, footer, children, headerVariant = 'light' }: DrawerProps) {
  const dark = headerVariant === 'dark'
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && !closeDisabled && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9000] bg-cs-azul-oscuro/35 backdrop-blur-[2px]" />
        <Dialog.Content
          onEscapeKeyDown={(e) => closeDisabled && e.preventDefault()}
          onPointerDownOutside={(e) => closeDisabled && e.preventDefault()}
          className={cn(
            'fixed inset-y-0 right-0 z-[9001] flex h-full max-w-[92vw] flex-col bg-white shadow-[0_0_40px_rgba(6,20,148,0.2)]',
            xwide ? 'w-[1260px]' : wide ? 'w-[640px]' : 'w-[460px]',
          )}
        >
          <div className={cn('flex items-start justify-between p-[18px_22px]', dark ? 'bg-primary' : 'border-b border-border')}>
            <div>
              {eyebrow && <div className={cn('mb-1 text-[10.5px] font-bold tracking-[0.1em] uppercase', dark ? 'text-white/70' : 'text-primary')}>{eyebrow}</div>}
              <div className="flex items-center gap-2">
                <Dialog.Title className={cn('text-[17px] font-bold', dark ? 'text-white' : 'text-foreground')}>{title}</Dialog.Title>
                {titleExtra}
              </div>
              {subtitle && <div className={cn('mt-0.5 text-[11px]', dark ? 'text-white/70' : 'text-muted-foreground')}>{subtitle}</div>}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={closeDisabled}
                aria-label="Cerrar"
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg disabled:opacity-40',
                  dark ? 'text-white/80 hover:bg-white/10' : 'text-muted-foreground hover:bg-surface-hover',
                )}
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
