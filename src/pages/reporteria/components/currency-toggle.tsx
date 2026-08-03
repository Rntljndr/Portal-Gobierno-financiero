import { cn } from '@/shared/lib/utils'
import { currencyViews, type CurrencyView } from '@/data/reporteria'

interface CurrencyToggleProps {
  value: CurrencyView
  onChange: (v: CurrencyView) => void
}

export function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
  return (
    <div className="mx-8 mb-3 flex items-center rounded-xl border border-[#C4DFFF] bg-[#E4F0FF] p-[10px_16px]">
      <div className="shrink-0">
        <div className="text-[13px] leading-tight font-bold text-primary">Configurar vista</div>
        <div className="mt-0.5 text-[11.5px] text-[#3B7DD8]">Seleccioná la moneda para revisar los datos</div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-0.5 rounded-lg bg-primary/8 p-[3px]">
        {currencyViews.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              'rounded-md px-2.5 py-[5px] text-xs text-[#3B7DD8]',
              value === opt.id && 'bg-white font-bold text-primary shadow-[0_1px_4px_rgba(0,71,176,0.15)]',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
