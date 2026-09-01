import { cn } from '@/shared/lib/utils'
import type { ForecastTipo } from '@/data/forecast'

const TIPOS: { value: ForecastTipo; label: string }[] = [
  { value: 'global', label: 'Forecast Global' },
  { value: 'parcial', label: 'Forecast Parcial' },
]

export function TipoForecastSelector({ value, onChange }: { value: ForecastTipo; onChange: (v: ForecastTipo) => void }) {
  return (
    <div className="flex gap-3">
      {TIPOS.map((tipo) => {
        const active = value === tipo.value
        return (
          <label key={tipo.value} className={cn('flex flex-1 cursor-pointer items-center gap-2 rounded-lg border p-[10px_16px]', active ? 'border-primary bg-[#EEF4FF]' : 'border-border bg-white')}>
            <input type="radio" name="tipo" checked={active} onChange={() => onChange(tipo.value)} className="accent-primary" />
            <span className={cn('text-[12.5px] font-semibold', active ? 'text-primary' : 'text-cs-gris-oscuro')}>{tipo.label}</span>
          </label>
        )
      })}
    </div>
  )
}
