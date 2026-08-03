import { Button, Icon } from '@/shared/ui'
import { SettingsCard } from './settings-card'

interface PeriodoCardProps {
  fechaInicio: string
  fechaFin: string
  onFechaInicio: (v: string) => void
  onFechaFin: (v: string) => void
}

const inputClass = 'h-9 w-full rounded-md border border-border bg-white px-2.5 text-[13px] text-foreground outline-none focus:border-primary'
const labelClass = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase'

export function PeriodoCard({ fechaInicio, fechaFin, onFechaInicio, onFechaFin }: PeriodoCardProps) {
  return (
    <SettingsCard icon="ejercicios" title="Período del ejercicio">
      <div className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>Fecha de inicio</label>
          <input type="date" value={fechaInicio} onChange={(e) => onFechaInicio(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha de término</label>
          <input type="date" value={fechaFin} onChange={(e) => onFechaFin(e.target.value)} className={inputClass} />
        </div>
      </div>
    </SettingsCard>
  )
}

export function ForecastCard() {
  return (
    <SettingsCard icon="control" title="Forecast base">
      <div className="mb-3 rounded-lg border border-border p-[12px_14px]">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div className="text-[13px] leading-snug font-semibold text-foreground">
            Forecast Julio 2026 · Forecast Real · Último disponible
          </div>
          <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">AUTO</span>
        </div>
        <div className="mb-2.5 text-xs text-muted-foreground">La propuesta se genera a partir del último forecast disponible.</div>
        <Button variant="outline" size="sm">
          <Icon name="control" size={13} color="currentColor" /> Ver detalle del forecast
        </Button>
      </div>
      <div className="flex gap-2 rounded-lg border border-[#86EFAC] bg-[#F0FDF4] p-[12px_14px]">
        <Icon name="circle_check" size={16} color="#16A34A" />
        <div>
          <div className="mb-0.5 text-[13px] font-bold text-[#15803D]">Forecast base identificado</div>
          <div className="text-xs text-[#166534]">Forecast 2026 — Julio — Real: se usará como base de la propuesta presupuestaria 2027.</div>
        </div>
      </div>
    </SettingsCard>
  )
}
