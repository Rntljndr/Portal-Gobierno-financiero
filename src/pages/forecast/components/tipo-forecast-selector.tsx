import { cn } from '@/shared/lib/utils'
import type { ForecastTipo } from '@/data/forecast'

const TIPOS: { value: ForecastTipo; label: string }[] = [
  { value: 'global', label: 'Forecast Global' },
  { value: 'parcial', label: 'Forecast Parcial' },
]

export function TipoForecastSelector({ value, onChange, readOnly }: { value: ForecastTipo; onChange: (v: ForecastTipo) => void; readOnly?: boolean }) {
  return (
    <div className="flex gap-3">
      {TIPOS.map((tipo) => {
        const active = value === tipo.value
        return (
          <label
            key={tipo.value}
            className={cn(
              'flex flex-1 items-center gap-2 rounded-lg border p-[10px_16px]',
              readOnly ? 'cursor-default' : 'cursor-pointer',
              active ? 'border-primary bg-[#EEF4FF]' : 'border-border bg-white',
              readOnly && !active && 'opacity-50',
            )}
          >
            <input type="radio" name="tipo" checked={active} disabled={readOnly} onChange={() => onChange(tipo.value)} className="accent-primary" />
            <span className={cn('text-[12.5px] font-semibold', active ? 'text-primary' : 'text-cs-gris-oscuro')}>{tipo.label}</span>
          </label>
        )
      })}
    </div>
  )
}
