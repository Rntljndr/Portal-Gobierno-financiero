import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

export type ViewMode = 'cards' | 'tabla'

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="text-[12.5px] font-bold text-cs-gris-oscuro">Ver en:</span>
      <div className="flex">
        {(['cards', 'tabla'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-pressed={value === mode}
            title={mode === 'cards' ? 'Vista de tarjetas' : 'Vista de tabla'}
            className={cn(
              'flex size-[34px] items-center justify-center rounded-[9px] border-[1.5px] border-border-strong bg-white text-muted-foreground -ml-px first:ml-0 hover:border-primary hover:text-primary',
              value === mode && 'border-primary bg-[#EAF1FE] text-primary shadow-[inset_0_0_0_1px_#0047B0]',
            )}
          >
            <Icon name={mode === 'cards' ? 'view_cards' : 'view_table'} size={17} color="currentColor" stroke={1.7} />
          </button>
        ))}
      </div>
    </div>
  )
}
