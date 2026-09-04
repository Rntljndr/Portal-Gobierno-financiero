import { cn } from '@/shared/lib/utils'
import type { ForecastRound } from '@/data/forecast'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { COMPARISON_SERIES, fmtRealesOrDash, type ComparisonSeries, type RealesTotals } from '../lib/reales-calc'
import { forecastRoundFactor } from '../lib/forecast-comparison'
import { DesvioChip } from '@/shared/ui'

interface RealesComparisonRowProps {
  seriesKey: ComparisonSeries['key']
  months: number[]
  totals: RealesTotals
  currency: string
  identityColSpan: number
  forecastRound?: ForecastRound | null
}

export function RealesComparisonRow({ seriesKey, months, totals, currency, identityColSpan, forecastRound }: RealesComparisonRowProps) {
  const cfg = COMPARISON_SERIES[seriesKey]
  const fmt = (n: number) => fmtRealesOrDash(n, currency)
  const factor = seriesKey === 'forecast' && forecastRound ? forecastRoundFactor(forecastRound) : cfg.factor
  const isPlan = cfg.appliesTo === 'plan'

  const ownAcum = (isPlan ? totals.planAcum : totals.real) * factor
  const desvioAcum = totals.real - ownAcum
  const desvioAcumPct = ownAcum !== 0 ? (desvioAcum / ownAcum) * 100 : null

  const ownAnual = (isPlan ? totals.plan : totals.realMasForecast) * factor
  const desvioAnual = totals.realMasForecast - ownAnual
  const desvioAnualPct = ownAnual !== 0 ? (desvioAnual / ownAnual) * 100 : null

  return (
    <tr className="border-t border-dashed" style={{ background: cfg.bg, borderColor: cfg.border }}>
      <td className="p-[5px_10px_5px_10px] sticky left-0 z-[1]" style={{ background: cfg.bg }}>
        <span className="rounded border px-1.5 py-0.5 text-[10px] font-bold" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
          {cfg.label}
        </span>
      </td>
      <td colSpan={identityColSpan} style={{ background: cfg.bg }} />
      {months.map((v, i) => (
        <td key={i} className={cn('p-[5px_6px] text-right font-mono text-[11px]', (i === 0 || i === REALES_LAST_CLOSED) && 'border-l-2 border-l-[#D5DCF0]')} style={{ color: cfg.textColor }}>
          {fmt(v * factor)}
        </td>
      ))}
      <td className="p-[5px_8px] border-l-2 border-l-[#D5DCF0] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {isPlan ? fmt(ownAcum) : '—'}
      </td>
      <td className="p-[5px_8px] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {isPlan ? '—' : fmt(ownAcum)}
      </td>
      <td className={cn('p-[5px_8px] text-right font-mono text-[11px]', desvioAcum > 0 ? 'text-destructive' : 'text-success')}>
        {desvioAcum >= 0 ? '+' : ''}
        {fmt(desvioAcum)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={desvioAcumPct} />
      </td>
      <td className="p-[5px_8px] border-l-2 border-l-[#D5DCF0] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {isPlan ? fmt(ownAnual) : '—'}
      </td>
      <td className="p-[5px_8px] text-right font-mono text-[11px]" style={{ color: cfg.textColor }}>
        {isPlan ? '—' : fmt(ownAnual)}
      </td>
      <td className={cn('p-[5px_8px] text-right font-mono text-[11px]', desvioAnual > 0 ? 'text-destructive' : 'text-success')}>
        {desvioAnual >= 0 ? '+' : ''}
        {fmt(desvioAnual)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={desvioAnualPct} />
      </td>
    </tr>
  )
}
