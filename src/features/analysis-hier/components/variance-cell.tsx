import { formatTableAmount } from '@/shared/lib/format'

interface VarianceCellProps {
  a: number
  b: number
  pct: boolean
  bold?: boolean
}

export function VarianceCell({ a, b, pct, bold }: VarianceCellProps) {
  const diff = a - b
  const color = diff > 0 ? '#DC2626' : diff < 0 ? '#067647' : '#0047B0'
  const icon = diff > 0 ? '↑' : diff < 0 ? '↓' : ''
  let text: string
  if (diff === 0) {
    text = pct ? '0,0%' : '$ 0'
  } else if (pct) {
    const pv = b ? Math.abs(((a - b) / b) * 100) : 0
    text = `${pv.toFixed(1).replace('.', ',')}%`
  } else {
    text = formatTableAmount(Math.abs(diff))
  }

  return (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap" style={{ color, fontWeight: bold ? 700 : 500 }}>
      {icon && <span className="text-[9px] leading-none">{icon}</span>}
      {text}
    </span>
  )
}
