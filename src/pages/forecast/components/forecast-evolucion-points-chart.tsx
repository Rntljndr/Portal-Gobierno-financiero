import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import { formatCompact } from '@/shared/lib/format'
import { buildChartScale, CHART_H, CHART_W } from '../lib/forecast-chart-scale'

interface ForecastEvolucionPointsChartProps {
  meses: Record<string, number>
  cutoff: number
}

/** Variante de puntos (F: "una en el gráfico de barras y el otro de puntos con un selector") de
 * ForecastEvolucionChart — misma escala/geometría (forecast-chart-scale.ts), reemplaza las barras por
 * un punto + línea que conecta los 12 meses. */
export function ForecastEvolucionPointsChart({ meses, cutoff }: ForecastEvolucionPointsChartProps) {
  const values = monthKeys.map((k) => meses[k] || 0)
  const scale = buildChartScale(values, values.length)
  const zeroY = scale.yVal(0)
  const points = values.map((v, i) => `${scale.monthCx(i)},${scale.yVal(v)}`).join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
        <line x1={0} y1={zeroY} x2={CHART_W} y2={zeroY} stroke="#E4EAF6" strokeWidth={1.5} />
        <polyline points={points} fill="none" stroke="#0047B0" strokeWidth={1.5} opacity={0.5} />
        {values.map((v, i) => {
          const closed = i < cutoff
          const y = scale.yVal(v)
          const cx = scale.monthCx(i)
          return (
            <g key={monthKeys[i]}>
              <circle cx={cx} cy={y} r={closed ? 3.5 : 3} fill={closed ? '#0047B0' : '#fff'} stroke="#0047B0" strokeWidth={1.5}>
                <title>
                  {monthLabelsShort[i]}: {formatCompact(v)}
                </title>
              </circle>
              <text x={cx} y={CHART_H - 6} textAnchor="middle" fill="#94A3B8" fontSize={9}>
                {monthLabelsShort[i]}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-primary" /> Real
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full border border-primary bg-white" /> Forecast
        </span>
      </div>
    </div>
  )
}
