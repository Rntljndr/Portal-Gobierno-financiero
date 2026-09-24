import { cn } from '@/shared/lib/utils'
import { monthKeys } from '@/data/reporteria'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { FORECAST_IDENTITY_COL_COUNT } from '../lib/forecast-identity-cols'

function positionClass(i: number, cutoff: number) {
  return cn(i === 0 && 'border-l-2 border-l-[#CBD5E1]', i === cutoff && 'border-l-2 border-l-[#CBD5E1]')
}

interface ForecastPlanRowProps {
  plan: Record<string, number>
  cutoff: number
  variant: 'n4' | 'n7'
}

/** Fila fija de Plan bajo cada servicio (F: "tabla de Forecast por servicio") — mismo patrón visual
 * que RealesComparisonRow (reales/components/reales-comparison-row.tsx: borde punteado, fondo
 * neutro, chip de etiqueta en la columna de identidad), pero fija (no es un toggle de comparación
 * como en Reales) y sin desvío propio — es la referencia contra la que se lee la fila de arriba. Solo
 * "Total Plan" tiene valor acá: el resto de las columnas de cierre (Acumulado Real, Disponible,
 * Real+Forecast, Desvío, %Desvío) no aplican a una fila de referencia estática. */
export function ForecastPlanRow({ plan, cutoff, variant }: ForecastPlanRowProps) {
  const planTotal = monthKeys.reduce((s, k) => s + (plan[k] || 0), 0)
  const td = 'p-[6px_8px] text-right text-[11px] text-muted-foreground'

  return (
    <tr className="border-t border-dashed border-border bg-[#F8F9FD]">
      <td colSpan={FORECAST_IDENTITY_COL_COUNT[variant]} className="sticky left-0 z-[1] bg-[#F8F9FD] p-[6px_8px]">
        <span className="rounded border border-[#C8D9F5] bg-[#F7FAFF] px-1.5 py-0.5 text-[10px] font-bold text-[#0047B0]">Plan</span>
      </td>
      {monthKeys.map((k, i) => (
        <td key={k} className={cn(td, positionClass(i, cutoff))}>
          {formatForecastAmount(plan[k] || 0)}
        </td>
      ))}
      <td className={cn(td, 'border-l-2 border-l-border font-semibold')}>{formatForecastAmount(planTotal)}</td>
      <td className={td}>—</td>
      <td className={td}>—</td>
      <td className={cn(td, 'border-l-2 border-l-border')}>—</td>
      <td className={td}>—</td>
      <td className={cn(td, 'text-center')}>—</td>
      {variant === 'n7' && <td colSpan={3} className={td}>—</td>}
    </tr>
  )
}
