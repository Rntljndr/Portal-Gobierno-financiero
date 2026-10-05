import { formatNumber } from '@/shared/lib/format'

/** Formatea montos del módulo Forecast — F: "ajustar a como están en Reales y Preliminares" (0
 * decimales, separador de miles es-CL), revirtiendo el ajuste anterior de 2 decimales fijos (T3). F:
 * "los montos deben tener el signo $ antes del monto, en todos los niveles" — el signo va pegado a los
 * dígitos (antes del número, después del signo negativo si corresponde: "-$609", no "$-609").
 * Utilidad central: todas las vistas de Forecast deben formatear montos a través de esta función,
 * nunca con `toFixed`/`formatNumber` directo, para que un cambio de formato quede en un solo lugar. */
export function formatForecastAmount(n: number): string {
  return `${n < 0 ? '-' : ''}$${formatNumber(Math.abs(n))}`
}
