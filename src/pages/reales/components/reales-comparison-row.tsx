import { cn } from '@/shared/lib/utils'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { COMPARISON_SERIES, fmtReales, type ComparisonSeries, type RealesTotals } from '../lib/reales-calc'
import { DesvioChip } from './desvio-chip'

interface RealesComparisonRowProps {
  seriesKey: ComparisonSeries['key']
  months: number[]
  totals: RealesTotals
  currency: string
  identityColSpan: number
}

export function RealesComparisonRow({ seriesKey, months, totals, currency, identityColSpan }: RealesComparisonRowProps) {
  const cfg = COMPARISON_SERIES[seriesKey]
  const fmt = (n: number) => fmtReales(n, currency)
  const cPlan = totals.plan * cfg.factor
  const cReal = totals.real * cfg.factor
  const cRffc = totals.realMasForecast * cfg.factor
  const cDesvio = cRffc - cPlan
  const cPct = cPlan > 0 ? (cDesvio / cPlan) * 100 : 0

  return (
    <tr className="border-t border-dashed" style={{ background: cfg.bg, borderColor: cfg.border }}>
      <td className="p-[5px_10px_5px_28px] sticky left-0 z-[1]" style={{ background: cfg.bg }}>
        <span className="rounded border px-1.5 py-0.5 text-[10px] font-bold" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
          {cfg.label}
        </span>
      </td>
      <td colSpan={identityColSpan} style={{ background: cfg.bg }} />
      {months.map((v, i) => (
        <td key={i} className={cn('p-[5px_6px] text-right font-mono text-[11px]', (i === 0 || i === REALES_LAST_CLOSED) && 'border-l-2 border-l-[#D5DCF0]')} style={{ color: cfg.textColor }}>
          {fmt(v * cfg.factor)}
        </td>
      ))}
      <td className="p-[5px_8px] border-l-2 border-l-[#D5DCF0] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {fmt(cPlan)}
      </td>
      <td className="p-[5px_8px] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {fmt(cReal)}
      </td>
      <td />
      <td className="p-[5px_8px] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {fmt(cRffc)}
      </td>
      <td className={cn('p-[5px_8px] text-right font-mono text-[11px]', cDesvio > 0 ? 'text-[#B42318]' : 'text-[#067647]')}>
        {cDesvio >= 0 ? '+' : ''}
        {fmt(cDesvio)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={cPct} />
      </td>
    </tr>
  )
}
