import { cn } from '@/shared/lib/utils'

interface SegmentedTabsProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}

export function SegmentedTabs<T extends string>({ value, onChange, options }: SegmentedTabsProps<T>) {
  return (
    <div className="flex gap-0.5 rounded-xl border border-primary/22 bg-primary/8 p-[3px]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-lg px-4.5 py-1.5 text-xs font-bold whitespace-nowrap text-primary/70',
            value === opt.value && 'bg-primary text-white shadow-[0_1px_3px_rgba(6,20,60,0.2)]',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
