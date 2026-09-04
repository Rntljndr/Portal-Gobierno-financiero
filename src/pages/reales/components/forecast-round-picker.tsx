import type { ForecastRound } from '@/data/forecast'
import { forecastRoundLabel } from '../lib/forecast-comparison'

interface ForecastRoundPickerProps {
  rounds: ForecastRound[]
  options: ForecastRound[]
  selectedId: string | null
  onSelect: (id: string) => void
  onClear: () => void
}

export function ForecastRoundPicker({ rounds, options, selectedId, onSelect, onClear }: ForecastRoundPickerProps) {
  return (
    <div className="border-b border-[#F1F4FB] py-3.5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[13px] font-semibold text-foreground">Ejercicio de forecast</div>
        {selectedId && (
          <button type="button" onClick={onClear} className="text-[11px] font-semibold text-primary hover:underline">
            Limpiar
          </button>
        )}
      </div>
      {options.length === 0 ? (
        <div className="text-[11.5px] text-muted-foreground">No hay ejercicios de forecast disponibles para comparar.</div>
      ) : (
        <select
          value={selectedId ?? ''}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-lg border border-border bg-white p-[10px_12px] text-[12.5px] font-medium text-foreground outline-none focus:border-primary"
        >
          <option value="" disabled>
            Seleccioná un ejercicio
          </option>
          {options.map((round) => (
            <option key={round.id} value={round.id}>
              {forecastRoundLabel(rounds, round)}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
