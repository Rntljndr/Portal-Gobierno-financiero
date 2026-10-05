import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import { buildChartScale, CHART_H, CHART_W } from '../lib/forecast-chart-scale'

interface ForecastHeadcountChartProps {
  totalPorMes: Record<string, number>
}

/** Gráfico de Headcount (M4, ejemplo de servicio de rubro nómina) — mismo patrón de barras que
 * ForecastEvolucionChart, una sola serie (dotación total del servicio por mes), reimplementado acá
 * porque pages/<A> nunca importa de pages/<B>. Va después del gráfico de Evolución Real + Forecast. */
export function ForecastHeadcountChart({ totalPorMes }: ForecastHeadcountChartProps) {
  const values = monthKeys.map((k) => totalPorMes[k] || 0)
  const scale = buildChartScale(values, values.length)
  const zeroY = scale.yVal(0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white p-[20px]">
      <div className="mb-3 text-[13px] font-bold text-foreground">Headcount</div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
        <line x1={0} y1={zeroY} x2={CHART_W} y2={zeroY} stroke="#E4EAF6" strokeWidth={1.5} />
        {values.map((v, i) => {
          const y = scale.yVal(v)
          const cx = scale.monthCx(i)
          return (
            <g key={monthKeys[i]}>
              <rect x={cx - scale.barW / 2} y={y} width={scale.barW} height={Math.max(zeroY - y, 0)} rx={2} fill="#6922E7">
                <title>
                  {monthLabelsShort[i]}: {v}
                </title>
              </rect>
              <text x={cx} y={CHART_H - 6} textAnchor="middle" fill="#94A3B8" fontSize={9}>
                {monthLabelsShort[i]}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm" style={{ background: '#6922E7' }} /> Headcount total
        </span>
      </div>
    </div>
  )
}
