import type { ForecastMonth } from '@/data/forecast'

interface ForecastChartProps {
  data: ForecastMonth[]
  width?: number
  height?: number
}

function buildLine(data: ForecastMonth[], key: 'real' | 'forecast' | 'optimistic', x: (i: number) => number, y: (v: number) => number) {
  return data
    .map((d, i) => (d[key] == null ? null : { x: x(i), y: y(d[key] as number) }))
    .filter((p): p is { x: number; y: number } => p !== null)
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`)
    .join(' ')
}

export function ForecastChart({ data, width = 720, height = 280 }: ForecastChartProps) {
  const pad = { t: 20, r: 24, b: 30, l: 56 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b
  const allValues = data.flatMap((d) => [d.real, d.forecast, d.optimistic].filter((v): v is number => v != null))
  const maxV = Math.max(...allValues) * 1.05
  const x = (i: number) => pad.l + (i / (data.length - 1)) * innerW
  const y = (v: number) => pad.t + innerH - (v / maxV) * innerH
  const yTicks = 5

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = (maxV / yTicks) * i
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + innerW} y1={y(v)} y2={y(v)} stroke="#E2E8F0" strokeDasharray="3 3" />
            <text x={pad.l - 8} y={y(v)} fontSize="10" fill="#8A90A2" textAnchor="end" dominantBaseline="middle">
              ${Math.round(v / 1000)}K
            </text>
          </g>
        )
      })}
      {data.map((d, i) => (
        <text key={d.month} x={x(i)} y={height - 8} fontSize="10" fill="#64748B" textAnchor="middle">
          {d.month}
        </text>
      ))}
      <path d={buildLine(data, 'optimistic', x, y)} fill="none" stroke="#22976B" strokeWidth="1.8" strokeDasharray="4 4" />
      <path d={buildLine(data, 'forecast', x, y)} fill="none" stroke="#6922E7" strokeWidth="2" strokeDasharray="5 4" />
      <path d={buildLine(data, 'real', x, y)} fill="none" stroke="#0047B0" strokeWidth="2.6" />
      {data.map(
        (d, i) =>
          d.real != null && (
            <circle key={i} cx={x(i)} cy={y(d.real)} r="3.5" fill="#0047B0" stroke="#fff" strokeWidth="1.5" />
          ),
      )}
    </svg>
  )
}
