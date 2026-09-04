import type { ForecastRound } from '@/data/forecast'
import { ForecastRoundPicker } from './forecast-round-picker'

interface RealesForecastCheckProps {
  rounds: ForecastRound[]
  options: ForecastRound[]
  checked: boolean
  selectedId: string | null
  onToggle: (checked: boolean) => void
  onSelect: (id: string) => void
}

export function RealesForecastCheck({ rounds, options, checked, selectedId, onToggle, onSelect }: RealesForecastCheckProps) {
  return (
    <div className="border-b border-[#F1F4FB] py-3">
      <label className="flex cursor-pointer items-center gap-3">
        <input type="checkbox" checked={checked} onChange={(e) => onToggle(e.target.checked)} className="size-4 accent-primary" />
        <div>
          <div className="text-[13px] font-semibold text-foreground">Forecast</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Comparar con un ejercicio de forecast</div>
        </div>
      </label>
      {checked && (
        <div className="mt-3">
          <ForecastRoundPicker rounds={rounds} options={options} selectedId={selectedId} onSelect={onSelect} onClear={() => onToggle(false)} />
        </div>
      )}
    </div>
  )
}
