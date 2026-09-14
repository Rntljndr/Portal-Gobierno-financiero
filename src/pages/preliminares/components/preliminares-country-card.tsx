import type { PrelimCountryRow } from '../lib/preliminares-by-country'

const FLAG: Record<string, string> = {
  Argentina: '🇦🇷', Brasil: '🇧🇷', Chile: '🇨🇱', Colombia: '🇨🇴', Perú: '🇵🇪', Uruguay: '🇺🇾', 'Estados Unidos': '🇺🇸',
}

function MetricRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'up' | 'down' | 'hl' | 'muted' }) {
  const toneClass =
    tone === 'up' ? 'text-[#DC2626]' : tone === 'down' ? 'text-[#067647]' : tone === 'hl' ? 'text-primary' : tone === 'muted' ? 'text-[#8A90A2]' : 'text-foreground'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

const EmptyValue = () => <span className="inline-block h-0 w-[22px] border-b-2 border-[#C2C8D4] align-middle" />

export function PreliminaresCountryCard({ c }: { c: PrelimCountryRow }) {
  return (
    <div className="w-full rounded-2xl bg-white p-[11px_10px] text-left shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="truncate text-[10.5px] font-extrabold tracking-wide text-primary">
          {FLAG[c.pais] ?? ''} {c.pais}
        </span>
        <span className="ml-1 shrink-0 text-[9px] font-bold tracking-wide text-[#8A90A2]">{c.empty ? '' : c.moneda}</span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Preliminar del mes" value={c.empty ? <EmptyValue /> : c.preliminarMes} tone="hl" />
        <MetricRow label="Plan del mes" value={c.empty ? <EmptyValue /> : c.planMes} tone="muted" />
        <MetricRow label="Forecast del mes" value={c.empty ? <EmptyValue /> : c.forecastMes} tone="muted" />
        <div className="my-px h-px bg-border" />
        <MetricRow label="Desvío $ mes" value={c.empty ? <EmptyValue /> : c.desvioMonto} tone={c.empty ? undefined : c.over ? 'up' : 'down'} />
        <MetricRow label="Desvío % mes" value={c.empty ? <EmptyValue /> : c.desvioPct} tone={c.empty ? undefined : c.over ? 'up' : 'down'} />
      </div>
    </div>
  )
}
