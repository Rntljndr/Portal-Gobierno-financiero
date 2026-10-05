/** Comparativa de las tablas de servicios (N4/N7) del forecast activo — mismo patrón que el botón
 * "Comparar" de Reales, pero con solo dos campos (Plan y un forecast anterior a elección, sin "Año
 * anterior": no aplica a Forecast, ver forecast-comparativa.ts#ForecastComparativa para la misma
 * decisión ya tomada en M3). Cada campo marcado agrega una fila de comparación bajo cada línea de
 * servicio, con desvío calculado contra esa fila (igual que RealesComparisonRow). */
export interface ForecastTablaComparativa {
  plan: boolean
  forecastRoundId: string | null
}

/** Plan queda marcado por defecto: antes de este ajuste la fila de Plan siempre se mostraba, así que
 * el valor por defecto mantiene la vista sin cambios hasta que alguien la destilde a propósito. */
export const EMPTY_TABLA_COMPARATIVA: ForecastTablaComparativa = { plan: true, forecastRoundId: null }

export function forecastTablaComparativaCount(c: ForecastTablaComparativa): number {
  return (c.plan ? 1 : 0) + (c.forecastRoundId ? 1 : 0)
}
