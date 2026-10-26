import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'
import { Icon, type IconName } from './icon'

/** IconBox del design system: radius 12. Alert #FFF4E0 · Error #FEE8E8 · Info #EFF4FF · Neutral #F3F5FC ·
 * Success #E3F9EC · Theme #061494. Tamaño `lg` 64px (padding 16, como el Penpot) y `sm` 32px (el mismo
 * que usa KpiCard) para tarjetas y listas. */
const iconBoxVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      alert: 'bg-warning-surface text-warning',
      error: 'bg-destructive-surface text-destructive',
      info: 'bg-info-surface text-primary',
      neutral: 'bg-surface-elevated text-cs-gris-oscuro',
      success: 'bg-success-surface text-success',
      theme: 'bg-cs-azul-oscuro text-white',
    },
    size: {
      lg: 'size-16 rounded-xl',
      sm: 'size-8 rounded-lg',
    },
  },
  defaultVariants: { variant: 'info', size: 'sm' },
})

const ICON_SIZE = { lg: 28, sm: 16 } as const

interface IconBoxProps extends VariantProps<typeof iconBoxVariants> {
  icon: IconName
  className?: string
}

export function IconBox({ icon, variant, size, className }: IconBoxProps) {
  return (
    <span className={cn(iconBoxVariants({ variant, size, className }))}>
      <Icon name={icon} size={ICON_SIZE[size ?? 'sm']} color="currentColor" />
    </span>
  )
}
