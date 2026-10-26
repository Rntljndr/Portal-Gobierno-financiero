import { cn } from '@/shared/lib/utils'

interface ViewToggleProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  ariaLabel?: string
}

/** toggle / rr-vista del design system: alto 41px, radius 8, borde rgba(6,20,148,0.18), padding 4;
 * opciones Montserrat 12 w500 — activa en azul de marca con texto blanco, inactiva gris #8A90A2. */
export function ViewToggle<T extends string>({ value, onChange, options, ariaLabel }: ViewToggleProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex h-[41px] items-stretch gap-1 rounded-lg border border-border-strong bg-white p-1">
      {options.map((o) => {
        const activo = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-sm px-3 text-xs font-medium whitespace-nowrap transition-colors',
              activo ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-surface-hover hover:text-primary',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
