import { countryFlags, type CountryBudget, type MetricMode } from '@/data/reporteria'
import { formatTableAmount, formatTableAmountUSD } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'

type Tone = 'increase' | 'decrease' | 'hl' | 'muted'

function MetricRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: Tone }) {
  const toneClass =
    tone === 'increase' ? 'text-[#DC2626]' : tone === 'decrease' ? 'text-[#067647]' : tone === 'hl' ? 'text-primary' : tone === 'muted' ? 'text-[#8A90A2]' : 'text-foreground'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

const EmptyValue = () => <span className="inline-block h-0 w-[22px] border-b-2 border-[#C2C8D4] align-middle" />

interface CountrySummaryCardProps {
  c: CountryBudget
  metricMode: MetricMode
  isDolar?: boolean
  active: boolean
  selected: boolean
  onClick: () => void
}

export function CountrySummaryCard({ c, metricMode, isDolar = false, active, selected, onClick }: CountrySummaryCardProps) {
  const fmt = isDolar ? formatTableAmountUSD : formatTableAmount
  const secondaryLabel = metricMode === 'target' ? 'Target' : 'Forecast + IPC'
  const secondaryVal = metricMode === 'target' ? Math.round(c.fIPC * 0.975) : c.fIPC
  const varAbs = c.empty ? 0 : c.fBase - c.plan
  const varPct = c.plan && !c.empty ? (varAbs / c.plan) * 100 : 0
  const varSecondary = c.empty ? 0 : c.fBase - secondaryVal
  const varSecondaryPct = secondaryVal && !c.empty ? (varSecondary / secondaryVal) * 100 : 0
  const varTone: Tone | undefined = c.empty ? undefined : varAbs > 0 ? 'increase' : 'decrease'
  const varSecondaryTone: Tone | undefined = c.empty ? undefined : varSecondary > 0 ? 'increase' : 'decrease'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-w-[165px] max-w-[220px] flex-1 rounded-2xl bg-white p-[11px_10px] text-left shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)] transition-opacity',
        selected && 'ring-2 ring-primary',
        !active && 'opacity-55',
      )}
    >
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="truncate text-[10.5px] font-extrabold tracking-wide text-primary">
          {countryFlags[c.pais]} {c.pais}
        </span>
        <span className="ml-1 shrink-0 text-[9px] font-bold tracking-wide text-[#8A90A2]">{c.empty ? '' : isDolar ? 'US$' : 'MM'}</span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Plan" value={c.empty ? <EmptyValue /> : fmt(c.plan)} />
        <MetricRow label="Forecast base" value={c.empty ? <EmptyValue /> : fmt(c.fBase)} tone="muted" />
        <MetricRow
          label="Variación $"
          value={c.empty ? <EmptyValue /> : `${varAbs > 0 ? '+' : ''}${fmt(Math.abs(varAbs))}`}
          tone={varTone}
        />
        <MetricRow
          label="Variación %"
          value={c.empty ? <EmptyValue /> : `${varPct > 0 ? '+' : ''}${Math.abs(varPct).toFixed(1)}%`}
          tone={varTone}
        />
        <div className="my-px h-px bg-border" />
        <MetricRow label={secondaryLabel} value={c.empty ? <EmptyValue /> : fmt(secondaryVal)} tone="hl" />
        <MetricRow
          label="Variación $"
          value={c.empty ? <EmptyValue /> : `${varSecondary > 0 ? '+' : ''}${fmt(Math.abs(varSecondary))}`}
          tone={varSecondaryTone}
        />
        <MetricRow
          label="Variación %"
          value={c.empty ? <EmptyValue /> : `${varSecondaryPct > 0 ? '+' : ''}${Math.abs(varSecondaryPct).toFixed(1)}%`}
          tone={varSecondaryTone}
        />
        <div className="my-px h-px bg-border" />
        <MetricRow label="HC Plan" value={c.hcPlan > 0 ? c.hcPlan.toLocaleString('es-CL') : <EmptyValue />} />
        <MetricRow label="HC forecast base" value={c.hcForecast > 0 ? c.hcForecast.toLocaleString('es-CL') : <EmptyValue />} />
      </div>
      {c.empty && (
        <div className="mt-2.5 border-t border-dashed border-border pt-2 text-center text-[10px] font-semibold tracking-wide text-[#98A0AE] uppercase">
          Sin presupuesto cargado
        </div>
      )}
    </button>
  )
}
