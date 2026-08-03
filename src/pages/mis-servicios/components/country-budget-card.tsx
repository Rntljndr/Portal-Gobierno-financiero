import { Icon } from '@/shared/ui'
import { paisFlag } from '@/data/services'
import type { CountryBudgetRow } from '../lib/budget-by-country'

function MetricRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'up' | 'down' | 'ipc' | 'hl' | 'muted' }) {
  const toneClass =
    tone === 'up' ? 'text-[#067647]' : tone === 'down' ? 'text-[#DC2626]' : tone === 'ipc' ? 'text-[#E0A500]' : tone === 'hl' ? 'text-primary' : tone === 'muted' ? 'text-[#8A90A2]' : 'text-foreground'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

const EmptyValue = () => <span className="inline-block h-0 w-[22px] border-b-2 border-[#C2C8D4] align-middle" />

export function CountryBudgetCard({ c, onViewFx }: { c: CountryBudgetRow; onViewFx: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-[11px_10px] shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="text-[10.5px] font-extrabold tracking-wide text-primary">{c.label}</span>
        <span className="text-[9px] font-bold tracking-wide text-[#8A90A2]">{c.moneda}</span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Plan" value={c.empty ? <EmptyValue /> : c.plan} />
        <MetricRow label="Forecast base" value={c.empty ? <EmptyValue /> : c.base} tone="muted" />
        <MetricRow label="Forecast + IPC" value={c.empty ? <EmptyValue /> : c.fcIpc} tone="hl" />
        <div className="my-px h-px bg-border" />
        <MetricRow label="Variación $" value={c.empty ? <EmptyValue /> : c.varAbs} tone={c.empty ? undefined : c.up ? 'up' : 'down'} />
        <MetricRow
          label="Variación %"
          value={c.empty ? <EmptyValue /> : <>{c.varPct}<span className="ml-1 text-[13px]">{c.up ? '↗' : '↘'}</span></>}
          tone={c.empty ? undefined : c.up ? 'up' : 'down'}
        />
        <div className="my-px h-px bg-border" />
        <MetricRow label="IPC" value={c.empty ? <EmptyValue /> : c.ipc} tone={c.empty ? undefined : 'ipc'} />
      </div>
      {c.empty ? (
        <div className="mt-2.5 border-t border-dashed border-border pt-2 text-center text-[10px] font-semibold tracking-wide text-[#98A0AE] uppercase">
          Sin presupuesto cargado
        </div>
      ) : (
        <button
          type="button"
          onClick={onViewFx}
          className="mt-2.5 flex w-full items-center justify-between gap-1.5 rounded-lg bg-primary/7 px-2 py-[7px] hover:bg-primary/14"
        >
          <span className="flex items-center text-[10.5px] font-bold whitespace-nowrap text-primary">
            <span className="mr-1.5 text-[11px]">{paisFlag[c.pais]}</span>
            Conversión
          </span>
          <Icon name="chevron_right" size={13} color="#0047B0" />
        </button>
      )}
    </div>
  )
}
