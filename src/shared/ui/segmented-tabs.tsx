import { cn } from '@/shared/lib/utils'

interface SegmentedTabsProps<T extends string> {
  value: T
  onChange: (v: T) => void
  /** `disabled` deja la opción visible pero no seleccionable; `title` explica por qué (tooltip). */
  options: { value: T; label: string; disabled?: boolean; title?: string }[]
  /** `sm` = versión compacta para usar junto al título de una sección; `default` para encabezados de página. */
  size?: 'default' | 'sm'
}

export function SegmentedTabs<T extends string>({ value, onChange, options, size = 'default' }: SegmentedTabsProps<T>) {
  return (
    <div className={cn('flex gap-0.5 border border-primary/22 bg-primary/8', size === 'sm' ? 'rounded-lg p-0.5' : 'rounded-xl p-[3px]')}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={opt.disabled}
          title={opt.title}
          onClick={() => onChange(opt.value)}
          className={cn(
            'font-bold whitespace-nowrap text-primary/70',
            size === 'sm' ? 'rounded-md px-2.5 py-1 text-xxs' : 'rounded-lg px-4.5 py-1.5 text-xs',
            value === opt.value && 'bg-primary text-white shadow-[0_1px_3px_rgba(6,20,60,0.2)]',
            opt.disabled && 'cursor-not-allowed text-primary/30',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
