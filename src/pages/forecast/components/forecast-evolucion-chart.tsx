import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import { formatCompact } from '@/shared/lib/format'
import { buildChartScale, CHART_H, CHART_W } from '../lib/forecast-chart-scale'

interface ForecastEvolucionChartProps {
  meses: Record<string, number>
  cutoff: number
  /** Plan de referencia (C9): agrega una barra de Plan al lado de la de Real+Forecast, para comparar
   * contra ella — ya no hay comparación Forecast vs. Real (Real+Forecast es una sola barra, con dos
   * opacidades según el mes esté cerrado o no). Sin `plan`, se ve solo esa barra (comportamiento
   * previo, usado en la vista agregada por N4). */
  plan?: Record<string, number>
  /** Forecast anterior elegido en la Comparativa (M3) — se dibuja como línea punteada superpuesta,
   * no como una tercera barra, para no saturar el gráfico. */
  anterior?: Record<string, number>
}

const PLAN_COLOR = '#94A3B8'
const ANTERIOR_COLOR = '#F59E0B'
/** A9: Real y Forecast deben distinguirse sin depender de la leyenda — antes eran el mismo
 * `#0047B0` con solo la opacidad distinta (0.4), muy parecidos a simple vista. Mantenemos la misma
 * familia de azul (son la misma serie, solo que una mitad es dato cerrado y la otra proyectado) pero
 * con un tono claramente más claro y sólido, no una variante de opacidad. */
const FORECAST_COLOR = '#7FB2F0'

export function ForecastEvolucionChart({ meses, cutoff, plan, anterior }: ForecastEvolucionChartProps) {
  const values = monthKeys.map((k) => meses[k] || 0)
  const planValues = plan ? monthKeys.map((k) => plan[k] || 0) : []
  const anteriorValues = anterior ? monthKeys.map((k) => anterior[k] || 0) : []
  const scale = buildChartScale([...values, ...planValues, ...anteriorValues], values.length)
  const zeroY = scale.yVal(0)
  const gap = 2
  const barW = plan ? scale.groupW * 0.3 : scale.barW
  const anteriorPoints = anteriorValues.map((v, i) => `${scale.monthCx(i)},${scale.yVal(v)}`).join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} className="block overflow-visible text-[11px]">
        <line x1={0} y1={zeroY} x2={CHART_W} y2={zeroY} stroke="#E4EAF6" strokeWidth={1.5} />
        {values.map((v, i) => {
          const closed = i < cutoff
          const y = scale.yVal(v)
          const cx = scale.monthCx(i)
          const mainX = plan ? cx + gap / 2 : cx - barW / 2
          const planY = plan ? scale.yVal(planValues[i]) : 0
          return (
            <g key={monthKeys[i]}>
              {plan && (
                <rect x={cx - barW - gap / 2} y={planY} width={barW} height={Math.max(zeroY - planY, 0)} rx={2} fill={PLAN_COLOR}>
                  <title>
                    Plan {monthLabelsShort[i]}: {formatCompact(planValues[i])}
                  </title>
                </rect>
              )}
              <rect x={mainX} y={y} width={barW} height={Math.max(zeroY - y, 0)} rx={2} fill={closed ? '#0047B0' : FORECAST_COLOR}>
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
        {anterior && <polyline points={anteriorPoints} fill="none" stroke={ANTERIOR_COLOR} strokeWidth={1.5} strokeDasharray="2 2" />}
        {anterior &&
          anteriorValues.map((v, i) => (
            <circle key={monthKeys[i]} cx={scale.monthCx(i)} cy={scale.yVal(v)} r={2.5} fill={ANTERIOR_COLOR}>
              <title>
                Forecast anterior {monthLabelsShort[i]}: {formatCompact(v)}
              </title>
            </circle>
          ))}
      </svg>
      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
        {plan && (
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-sm" style={{ background: PLAN_COLOR }} /> Plan
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm bg-primary" /> Real
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm" style={{ background: FORECAST_COLOR }} /> Forecast
        </span>
        {anterior && (
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full" style={{ background: ANTERIOR_COLOR }} /> Forecast anterior
          </span>
        )}
      </div>
    </div>
  )
}
