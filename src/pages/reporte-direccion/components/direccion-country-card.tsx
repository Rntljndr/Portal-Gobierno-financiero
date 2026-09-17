import { countryFlags, type CurrencyView } from '@/data/reporteria'
import type { DireccionPais } from '@/data/reporte-direccion'
import { formatNumber, formatMillones, formatPercentCL, toUSD } from '@/shared/lib/format'
import { computeDireccionMetrics } from '../lib/direccion-metrics'
import type { VistaNumero } from '@/shared/ui'

type Tone = 'variance' | 'hl'

/** Semáforo de cifras financieras del sistema de diseño: positivo verde, negativo rojo. */
function MetricRow({ label, value, tone, raw }: { label: string; value: string; tone?: Tone; raw?: number }) {
  const varianceClass = raw != null ? (raw > 0 ? 'text-[color:var(--success)]' : raw < 0 ? 'text-[color:var(--destructive)]' : 'text-muted-foreground') : ''
  const toneClass = tone === 'variance' ? varianceClass : tone === 'hl' ? 'text-primary' : 'text-foreground'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[8.5px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <b className={`text-[11.5px] font-extrabold tabular-nums ${toneClass}`}>{value}</b>
    </div>
  )
}

interface DireccionCountryCardProps {
  pais: DireccionPais
  vista: CurrencyView
  vistaNumero: VistaNumero
  /** false cuando hay un país activo (filtro o selector de moneda) y no es este — la card se mantiene
   * en la grilla pero sin mostrar cifras, en vez de desaparecer. */
  activo: boolean
}

export function DireccionCountryCard({ pais, vista, vistaNumero, activo }: DireccionCountryCardProps) {
  const m = computeDireccionMetrics(pais)
  const isDolar = vista === 'dolar'
  const fmt = (v: number) => {
    if (!activo) return '-'
    const converted = isDolar ? toUSD(v) : v
    return vistaNumero === 'millones' ? formatMillones(converted) : formatNumber(converted)
  }
  const fmtPct = (v: number) => (activo ? formatPercentCL(v) : '-')

  return (
    <div className="w-full rounded-2xl bg-white p-[11px_10px] text-left shadow-[0_1px_2px_rgba(6,20,60,0.05),0_5px_14px_-6px_rgba(6,20,60,0.14)]">
      <div className="mb-1.5 flex items-center justify-between border-b border-primary/12 pb-1.5">
        <span className="truncate text-[10.5px] font-extrabold tracking-wide text-primary">
          {countryFlags[pais.nombre] ?? ''} {pais.nombre}
        </span>
        <span className="ml-1 shrink-0 text-[9px] font-bold tracking-wide text-[#8A90A2]">{isDolar ? 'US$' : 'ML'}</span>
      </div>
      <div className="flex flex-col gap-1">
        <MetricRow label="Total Real" value={fmt(pais.real)} />
        <MetricRow label="Total Plan" value={fmt(pais.plan)} tone="hl" />
        <MetricRow label="Var. vs Plan" value={fmt(m.varVsPlan)} tone="variance" raw={activo ? m.varVsPlan : undefined} />
        <MetricRow label="Var. %" value={fmtPct(m.varPct)} tone="variance" raw={activo ? m.varPct : undefined} />
        <div className="my-px h-px bg-border" />
        <MetricRow label="Año Anterior" value={fmt(pais.realAnterior)} />
        <MetricRow label="Var. vs A/A" value={fmt(m.varAA)} tone="variance" raw={activo ? m.varAA : undefined} />
        <MetricRow label="Var. A/A %" value={fmtPct(m.varAAPct)} tone="variance" raw={activo ? m.varAAPct : undefined} />
      </div>
    </div>
  )
}
