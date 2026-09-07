import { cn } from '@/shared/lib/utils'
import type { ForecastRound } from '@/data/forecast'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { COMPARISON_SERIES, fmtRealesOrDash, type ComparisonSeries, type RealesTotals } from '../lib/reales-calc'
import { forecastRoundFactor } from '../lib/forecast-comparison'
import { REALES_SUBPEP_COL_W } from '../lib/reales-table-cols'
import { DesvioArrow, DesvioChip } from '@/shared/ui'

interface RealesComparisonRowProps {
  seriesKey: ComparisonSeries['key']
  months: number[]
  totals: RealesTotals
  currency: string
  colsColSpan: number
  showSubPep: boolean
  forecastRound?: ForecastRound | null
}

/** Filas de comparación (Ajuste R5): tono neutro/desaturado en toda la fila para no competir con la línea principal de Reales; solo la etiqueta conserva su color identificador. */
const mutedCell = 'text-muted-foreground'

export function RealesComparisonRow({ seriesKey, months, totals, currency, colsColSpan, showSubPep, forecastRound }: RealesComparisonRowProps) {
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
    <tr className="border-t border-dashed border-border bg-[#F8F9FD]">
      {showSubPep && <td className={cn('sticky left-0 z-[1] bg-[#F8F9FD]', REALES_SUBPEP_COL_W)} />}
      <td className={cn('p-[5px_10px] sticky z-[1] bg-[#F8F9FD]', showSubPep ? 'left-[72px]' : 'left-0')}>
        <span className="rounded border px-1.5 py-0.5 text-[10px] font-bold" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
          {cfg.label}
        </span>
      </td>
      <td colSpan={colsColSpan} className="bg-[#F8F9FD]" />
      {months.map((v, i) => {
        const ownMonthly = v * factor
        const pct = ownMonthly !== 0 ? ((v - ownMonthly) / ownMonthly) * 100 : null
        return (
          <td
            key={i}
            className={cn('p-[5px_6px] text-right font-mono text-[11px]', mutedCell, (i === 0 || i === REALES_LAST_CLOSED) && 'border-l-2 border-l-[#E2E6F0]')}
          >
            <span className="inline-flex items-center gap-0.5">
              <DesvioArrow pct={pct} />
              {fmt(ownMonthly)}
            </span>
          </td>
        )
      })}
      <td className={cn('p-[5px_8px] border-l-2 border-l-[#E2E6F0] text-right font-mono text-[11px] font-semibold', mutedCell)}>{fmt(ownAcum)}</td>
      <td className={cn('p-[5px_8px] text-right font-mono text-[11px]', mutedCell)}>
        {desvioAcum >= 0 ? '+' : ''}
        {fmt(desvioAcum)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={desvioAcumPct} />
      </td>
      <td className={cn('p-[5px_8px] border-l-2 border-l-[#E2E6F0] text-right font-mono text-[11px] font-semibold', mutedCell)}>{fmt(ownAnual)}</td>
      <td className={cn('p-[5px_8px] text-right font-mono text-[11px]', mutedCell)}>
        {desvioAnual >= 0 ? '+' : ''}
        {fmt(desvioAnual)}
      </td>
      <td className="p-[5px_8px] text-center">
        <DesvioChip pct={desvioAnualPct} />
      </td>
    </tr>
  )
}
