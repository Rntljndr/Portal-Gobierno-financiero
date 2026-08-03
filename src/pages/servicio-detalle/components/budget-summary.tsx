import { Icon } from '@/shared/ui'
import { formatNumber } from '@/shared/lib/format'
import { getDestinos, type Servicio } from '@/data/services'
import { CountryDistributionBar } from './country-distribution-bar'

function Metric({ label, value, tone }: { label: string; value: string; tone?: 'up' | 'down' }) {
  const color = tone === 'up' ? 'text-[#B42318]' : tone === 'down' ? 'text-[#067647]' : 'text-foreground'
  return (
    <div className="min-w-[110px]">
      <div className="mb-1 text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">{label}</div>
      <div className={`flex items-center gap-1 text-xl font-bold ${color}`}>
        {tone && <Icon name="trendup" size={18} color={tone === 'up' ? '#B42318' : '#067647'} />}
        {value}
      </div>
    </div>
  )
}

export function BudgetSummary({ s }: { s: Servicio }) {
  const variacion = s.forecastIPC - s.totalPlan
  const varPct = s.totalPlan ? (variacion / s.totalPlan) * 100 : 0
  const tone = variacion === 0 ? undefined : variacion > 0 ? 'up' : 'down'

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 p-[18px_24px]">
        <Metric label="Total presupuesto" value={`${s.moneda} ${formatNumber(s.totalPlan)}`} />
        <div className="h-8 w-px shrink-0 bg-border" />
        <Metric label="Forecast base + IPC" value={`${s.moneda} ${formatNumber(s.forecastIPC)}`} />
        <div className="h-8 w-px shrink-0 bg-border" />
        <Metric label="Variación %" value={variacion === 0 ? '—' : `${Math.abs(varPct).toFixed(1)}%`} tone={tone} />
        <div className="h-8 w-px shrink-0 bg-border" />
        <Metric label="Variación $" value={variacion === 0 ? '—' : `${s.moneda} ${formatNumber(Math.abs(variacion))}`} tone={tone} />
      </div>
      <div className="h-px bg-border" />
      <CountryDistributionBar segments={getDestinos(s)} />
    </div>
  )
}
