import { formatNumber } from '@/shared/lib/format'
import type { Servicio } from '@/data/services'

export function ServiceCardMetrics({ s }: { s: Servicio }) {
  const variacion = s.forecastIPC - s.forecastBase
  const varPct = s.forecastBase ? (variacion / s.forecastBase) * 100 : 0
  const tone = variacion > 0 ? 'text-[#067647]' : variacion < 0 ? 'text-[#DC2626]' : ''

  return (
    <div className="flex flex-col gap-1.5 text-xs text-cs-gris-oscuro">
      <div className="flex items-baseline justify-between">
        <span>Plan</span>
        <b className="text-[12.5px] font-bold tabular-nums text-foreground">
          {s.moneda} {formatNumber(s.totalPlan)}
        </b>
      </div>
      <div className="flex items-baseline justify-between">
        <span>Forecast base</span>
        <b className="text-[12.5px] font-semibold tabular-nums text-cs-gris-oscuro">
          {s.moneda} {formatNumber(s.forecastBase)}
        </b>
      </div>
      <div className="flex items-baseline justify-between">
        <span>Forecast + IPC</span>
        <b className="text-[12.5px] font-bold tabular-nums text-primary">
          {s.moneda} {formatNumber(s.forecastIPC)}
        </b>
      </div>
      <div className="my-0.5 h-px bg-border" />
      <div className="flex items-baseline justify-between">
        <span>Variación $</span>
        <b className={`text-[12.5px] font-bold tabular-nums ${tone}`}>
          {variacion === 0 ? '—' : `${variacion > 0 ? '+' : '−'}${s.moneda} ${formatNumber(Math.abs(variacion))}`}
        </b>
      </div>
      <div className="flex items-baseline justify-between">
        <span>Variación %</span>
        <b className={`text-[12.5px] font-bold tabular-nums ${tone}`}>
          {variacion === 0 ? '—' : `${varPct > 0 ? '+' : '−'}${Math.abs(varPct).toFixed(1)}%`}
        </b>
      </div>
      <div className="my-0.5 h-px bg-border" />
      <div className="flex items-baseline justify-between">
        <span>Servicio en Dólar</span>
        <b className="text-[12.5px] font-bold text-foreground">{s.moneda === 'USD' ? 'Sí' : 'No'}</b>
      </div>
    </div>
  )
}
