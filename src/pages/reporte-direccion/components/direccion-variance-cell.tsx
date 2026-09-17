import { formatNumber, formatMillones, formatPercentCL, toUSD } from '@/shared/lib/format'
import type { VistaNumero } from '@/shared/ui'

interface VarianceValueProps {
  value: number
  percent?: boolean
  bold?: boolean
  isDolar?: boolean
  vistaNumero?: VistaNumero
}

/** Semáforo de cifras financieras del sistema de diseño: positivo verde (#067647), negativo rojo (#B42318), cero en gris muted. */
export function VarianceValue({ value, percent, bold, isDolar, vistaNumero = 'nominal' }: VarianceValueProps) {
  const color = value > 0 ? 'var(--success)' : value < 0 ? 'var(--destructive)' : 'var(--muted-foreground)'
  const converted = isDolar ? toUSD(value) : value
  const text = percent ? formatPercentCL(value) : vistaNumero === 'millones' ? formatMillones(converted) : formatNumber(converted)
  return (
    <span style={{ color, fontWeight: bold ? 700 : 500 }}>{text}</span>
  )
}
