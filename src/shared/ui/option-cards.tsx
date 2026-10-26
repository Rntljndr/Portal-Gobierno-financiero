import { cn } from '@/shared/lib/utils'

interface OptionCardsProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; descripcion: string }[]
  'aria-label': string
}

/** Selección exclusiva como tarjetas compactas (título 14 + descripción 12); la activa va en azul de marca. */
export function OptionCards<T extends string>({ value, onChange, options, 'aria-label': ariaLabel }: OptionCardsProps<T>) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', options.length === 3 && 'lg:grid-cols-3')} role="radiogroup" aria-label={ariaLabel}>
      {options.map((o) => {
        const activa = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-xl border px-4 py-3 text-left transition-colors',
              activa ? 'border-sidebar-bg-2 bg-sidebar-bg-2 text-white' : 'border-border bg-white hover:border-border-strong hover:bg-surface-hover',
            )}
          >
            <div className={cn('text-sm font-bold', activa ? 'text-white' : 'text-foreground')}>{o.label}</div>
            <div className={cn('mt-0.5 text-xs', activa ? 'text-white/75' : 'text-muted-foreground')}>{o.descripcion}</div>
          </button>
        )
      })}
    </div>
  )
}
