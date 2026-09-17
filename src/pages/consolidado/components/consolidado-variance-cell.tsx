import { formatNumber, formatPercentCL } from '@/shared/lib/format'

interface VarianceCellProps {
  value: number
  percent?: boolean
  bold?: boolean
}

/** Aumento del Plan sobre Forecast+IPC = sobregasto propuesto → rojo; baja = favorable → verde. */
export function ConsolidadoVarianceValue({ value, percent, bold }: VarianceCellProps) {
  const color = value > 0 ? 'var(--destructive)' : value < 0 ? 'var(--success)' : 'var(--muted-foreground)'
  const text = percent ? formatPercentCL(value) : formatNumber(value)
  return <span style={{ color, fontWeight: bold ? 700 : 500 }}>{text}</span>
}
