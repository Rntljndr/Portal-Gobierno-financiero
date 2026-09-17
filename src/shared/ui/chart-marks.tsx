import type { ChartMonth } from '../lib/chart-geometry'
import { chartScale } from '../lib/chart-geometry'
import type { TooltipState } from './chart-tooltip'

interface MarksProps {
  months: ChartMonth[]
  scale: ReturnType<typeof chartScale>
  onHover: (t: TooltipState | null) => void
}

const COLOR = '#0047B0'

export function ChartBars({ months, scale, onHover }: MarksProps) {
  const barW = Math.max(6, Math.min(22, scale.groupW * 0.22))
  const gap = 2
  return (
    <>
      {months.map((m, mi) => {
        const cx = scale.monthCx(mi)
        const planH = Math.max(2, (m.plan / scale.maxVal) * scale.chartH)
        const fbH = Math.max(2, (m.fBase / scale.maxVal) * scale.chartH)
        const offset = cx - barW - gap / 2
        return (
          <g key={m.mes} onMouseEnter={() => onHover({ mi })} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
            <rect x={offset} y={scale.yVal(m.plan)} width={barW} height={planH} fill={COLOR} rx={1} />
            <rect x={offset + barW + gap} y={scale.yVal(m.fBase)} width={barW} height={fbH} fill={COLOR} opacity={0.42} rx={1} />
          </g>
        )
      })}
    </>
  )
}

export function ChartDots({ months, scale, onHover }: MarksProps) {
  return (
    <>
      {months.map((m, mi) => {
        if (mi === 0) return null
        const prev = months[mi - 1]
        return (
          <g key={m.mes}>
            <line x1={scale.monthCx(mi - 1)} y1={scale.yVal(prev.plan)} x2={scale.monthCx(mi)} y2={scale.yVal(m.plan)} stroke={COLOR} strokeWidth={1.5} />
            <line
              x1={scale.monthCx(mi - 1)}
              y1={scale.yVal(prev.fBase)}
              x2={scale.monthCx(mi)}
              y2={scale.yVal(m.fBase)}
              stroke={COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 2"
              opacity={0.55}
            />
          </g>
        )
      })}
      {months.map((m, mi) => (
        <g key={`dot-${m.mes}`} onMouseEnter={() => onHover({ mi })} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
          <circle cx={scale.monthCx(mi)} cy={scale.yVal(m.plan)} r={3} fill={COLOR} />
          <circle cx={scale.monthCx(mi)} cy={scale.yVal(m.fBase)} r={3} fill={COLOR} opacity={0.5} />
        </g>
      ))}
    </>
  )
}
