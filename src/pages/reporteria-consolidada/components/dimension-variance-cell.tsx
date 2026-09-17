import { formatNumber, formatPercentCL } from '@/shared/lib/format'

interface VarianceCellProps {
  value: number
  percent?: boolean
  bold?: boolean
}

/** Convención del tablero real: un aumento del Nuevo Plan sobre Forecast+IPC es un sobregasto propuesto → rojo;
 * una baja es favorable → verde. Es la inversa de la convención "positivo=verde" usada en Reporte de Dirección,
 * a propósito: ahí se compara Real vs Plan (ejecución), acá Plan vs Forecast+IPC (propuesta vs. base oficial).
 * Los montos ya llegan convertidos a la moneda de la vista elegida (ver vista-amounts.ts), sin conversión acá. */
export function DimVarianceValue({ value, percent, bold }: VarianceCellProps) {
  const color = value > 0 ? 'var(--destructive)' : value < 0 ? 'var(--success)' : 'var(--muted-foreground)'
  const text = percent ? formatPercentCL(value) : formatNumber(value)
  return <span style={{ color, fontWeight: bold ? 700 : 500 }}>{text}</span>
}
