import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import { formatCompact } from '@/shared/lib/format'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { calcN4Meses } from '../lib/forecast-edit-calc'
import { buildChartScale, CHART_H, CHART_W } from '../lib/forecast-chart-scale'

interface ForecastEvolucionChartProps {
  n4: ForecastN4Linea
  cutoff: number
}

/** Evolución mensual del forecast vs. real acumulado. SVG a mano (patrón visual de reporteria/plan-forecast-chart.tsx), sin librería de charting nueva. */
export function ForecastEvolucionChart({ n4, cutoff }: ForecastEvolucionChartProps) {
  const meses = calcN4Meses(n4)
  const values = monthKeys.map((k) => meses[k] || 0)
  const scale = buildChartScale(values, values.length)
  const zeroY = scale.yVal(0)

  return (
    <div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
        <line x1={0} y1={zeroY} x2={CHART_W} y2={zeroY} stroke="#E4EAF6" strokeWidth={1.5} />
        {values.map((v, i) => {
          const closed = i < cutoff
          const y = scale.yVal(v)
          const cx = scale.monthCx(i)
          return (
            <g key={monthKeys[i]}>
              <rect x={cx - scale.barW / 2} y={y} width={scale.barW} height={Math.max(zeroY - y, 0)} rx={2} fill="#0047B0" opacity={closed ? 1 : 0.4}>
                <title>
                  {monthLabelsShort[i]}: {formatCompact(v)}
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
          <span className="inline-block size-2 rounded-sm bg-primary" /> Real
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm bg-primary/40" /> Forecast
        </span>
      </div>
    </div>
  )
}
