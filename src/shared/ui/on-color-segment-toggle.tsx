import { cn } from '@/shared/lib/utils'

interface OnColorSegmentToggleProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string }[]
}

/** Segmented toggle en blanco/12% para usar sobre fondos de color (ej. la barra azul primary),
 * a diferencia de `SegmentedTabs` que está pensado para fondos claros. */
export function OnColorSegmentToggle<T extends string>({ value, onChange, options }: OnColorSegmentToggleProps<T>) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-white/12 p-[3px]">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'rounded-md px-3 py-[7px] text-[12.5px] font-semibold whitespace-nowrap text-white/80',
            value === opt.id && 'bg-white font-bold text-primary shadow-[0_1px_4px_rgba(0,20,60,0.25)]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
