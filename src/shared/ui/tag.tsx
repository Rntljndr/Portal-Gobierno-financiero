import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

/** Tag del design system: radius 999, padding 3/8, gap 4, Montserrat w500, sin borde.
 * Colores: Blue #EFF4FF/#0047B0 · Gray #F3F5FC/#8A90A2 · Green #E3F9EC/#067647 · Red #FEE8E8/#B42318 ·
 * Yellow #FFF4E0/#B45309 · Theme #FFFFFF/#0047B0. Tamaño default 14px; `sm` 12px (tablas y filas densas). */
const tagVariants = cva('inline-flex items-center gap-1 rounded-full px-2 py-[3px] font-medium whitespace-nowrap', {
  variants: {
    color: {
      blue: 'bg-info-surface text-primary',
      gray: 'bg-surface-elevated text-muted-foreground',
      green: 'bg-success-surface text-success',
      red: 'bg-destructive-surface text-destructive',
      yellow: 'bg-warning-surface text-warning',
      theme: 'bg-white text-primary',
    },
    size: {
      default: 'text-sm',
      sm: 'text-xs',
    },
  },
  defaultVariants: { color: 'blue', size: 'default' },
})

interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof tagVariants> {}

export function Tag({ className, color, size, ...props }: TagProps) {
  return <span className={cn(tagVariants({ color, size, className }))} {...props} />
}
