import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

/** FilterButton del design system: píldora (radius 999) fondo #F8FAFC, borde rgba(6,20,148,0.18),
 * padding 8/16, Montserrat 14 w500 azul. Activo: fondo de marca y texto blanco. `size="sm"` para filas
 * densas de chips (12px). */
const filterButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full border font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      active: {
        true: 'border-primary bg-primary text-white',
        false: 'border-border-strong bg-surface-subtle text-primary hover:bg-surface-hover',
      },
      size: {
        default: 'h-9 px-4 text-sm',
        sm: 'h-8 px-3 text-xs',
      },
    },
    defaultVariants: { active: false, size: 'default' },
  },
)

interface FilterButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>, VariantProps<typeof filterButtonVariants> {}

export function FilterButton({ className, active, size, ...props }: FilterButtonProps) {
  return <button type="button" aria-pressed={Boolean(active)} className={cn(filterButtonVariants({ active, size, className }))} {...props} />
}
