import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'
import { Icon, type IconName } from './icon'

/** Alert único del portal (estructura del aviso de periodo de edición de Forecast): ícono en círculo,
 * título de una línea (14 w500) con lo importante en negrita y, debajo, el detalle (12). Opcional: una
 * acción a la derecha y la X para cerrarlo.
 * Variantes: success (verde: plazo vigente, todo en orden) · info (azul: información) · warning (amarillo:
 * requiere atención) · error (rojo: plazo vencido o error). */
const alertVariants = cva('flex items-center gap-3 rounded-xl border px-4 py-3', {
  variants: {
    variant: {
      success: 'border-success-line bg-success-surface',
      info: 'border-info-line bg-info-surface',
      warning: 'border-warning-line bg-warning-surface',
      error: 'border-destructive-line bg-destructive-surface',
    },
  },
  defaultVariants: { variant: 'info' },
})

type Variant = NonNullable<VariantProps<typeof alertVariants>['variant']>

const CIRCULO: Record<Variant, string> = {
  success: 'border-success-line text-success',
  info: 'border-info-line text-primary',
  warning: 'border-warning-line text-warning',
  error: 'border-destructive-line text-destructive',
}

const ICONO: Record<Variant, IconName> = { success: 'info', info: 'info', warning: 'alert', error: 'alert' }

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: ReactNode
  children?: ReactNode
  icon?: IconName
  /** Acción a la derecha (p. ej. un botón "Ver mis líneas"). */
  action?: ReactNode
  /** Si se pasa, muestra la X para cerrar el aviso. */
  onDismiss?: () => void
  className?: string
}

export function Alert({ variant, title, children, icon, action, onDismiss, className }: AlertProps) {
  const v: Variant = variant ?? 'info'
  return (
    <div role={v === 'error' ? 'alert' : 'status'} className={cn(alertVariants({ variant: v }), className)}>
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full border bg-white/60', CIRCULO[v])}>
        <Icon name={icon ?? ICONO[v]} size={18} color="currentColor" />
      </span>
      <div className="min-w-0 flex-1">
        {title && <div className={cn('text-sm leading-snug font-medium', v === 'error' ? 'text-destructive' : 'text-foreground')}>{title}</div>}
        {children && <div className={cn('text-xs text-cs-gris-oscuro', title && 'mt-1')}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Cerrar aviso" className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/5">
          <Icon name="x_close" size={14} color="currentColor" />
        </button>
      )}
    </div>
  )
}
