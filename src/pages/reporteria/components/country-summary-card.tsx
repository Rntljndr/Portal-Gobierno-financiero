import { countryFlags, type CountryBudget } from '@/data/reporteria'
import { formatTableAmount } from '@/shared/lib/format'

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

export function CountrySummaryCard({ c }: { c: CountryBudget }) {
  const varAbs = c.empty ? 0 : c.fBase - c.plan
  const varPct = c.plan && !c.empty ? (varAbs / c.plan) * 100 : 0
  const varIpc = c.empty ? 0 : c.fBase - c.fIPC
  const varIpcPct = c.fIPC && !c.empty ? (varIpc / c.fIPC) * 100 : 0
  const varTone: Tone | undefined = c.empty ? undefined : varAbs > 0 ? 'increase' : 'decrease'
  const varIpcTone: Tone | undefined = c.empty ? undefined : varIpc > 0 ? 'increase' : 'decrease'

  return (
    <div className="min-w-[165px] max-w-[220px] flex-1 rounded-2xl bg-white p-[11px_10px] shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="truncate text-[10.5px] font-extrabold tracking-wide text-primary">
          {countryFlags[c.pais]} {c.pais}
        </span>
        <span className="ml-1 shrink-0 text-[9px] font-bold tracking-wide text-[#8A90A2]">{c.empty ? '' : 'MM'}</span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Plan" value={c.empty ? <EmptyValue /> : formatTableAmount(c.plan)} />
        <MetricRow label="Forecast base" value={c.empty ? <EmptyValue /> : formatTableAmount(c.fBase)} tone="muted" />
        <MetricRow label="Forecast + IPC" value={c.empty ? <EmptyValue /> : formatTableAmount(c.fIPC)} tone="hl" />
        <div className="my-px h-px bg-border" />
        <MetricRow
          label="Variación $"
          value={c.empty ? <EmptyValue /> : `${varAbs > 0 ? '+' : ''}${formatTableAmount(Math.abs(varAbs))}`}
          tone={varTone}
        />
        <MetricRow
          label="Variación %"
          value={c.empty ? <EmptyValue /> : `${varPct > 0 ? '+' : ''}${Math.abs(varPct).toFixed(1)}%`}
          tone={varTone}
        />
        <div className="my-px h-px bg-border" />
        <MetricRow
          label="Var. $ vs F+IPC"
          value={c.empty ? <EmptyValue /> : `${varIpc > 0 ? '+' : ''}${formatTableAmount(Math.abs(varIpc))}`}
          tone={varIpcTone}
        />
        <MetricRow
          label="Var. % vs F+IPC"
          value={c.empty ? <EmptyValue /> : `${varIpcPct > 0 ? '+' : ''}${Math.abs(varIpcPct).toFixed(1)}%`}
          tone={varIpcTone}
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
    </div>
  )
}
