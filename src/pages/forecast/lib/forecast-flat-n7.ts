import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'

export interface ForecastFlatN7Row {
  n4Codigo: string
  n4Nombre: string
  n7: ForecastN7Linea
  /** Todos los N7 hermanos del mismo N4 (incluido este) — necesario para recalcular la Llave de
   * Distribución Forecast de este N7 sin tener el ForecastN4Linea completo a mano (ver forecast-identidad.ts). */
  n4Siblings: ForecastN7Linea[]
}

/** Aplana todas las líneas N7 de todos los servicios N4 de una ronda en un solo listado — mismo
 * patrón que `realesN7Rows` (src/data/reales.ts): un array pre-armado, no un drill-down por servicio.
 * Usado por el tab "Forecast N7" (F: tabs como en Reales). */
export function buildFlatN7Rows(lineas: ForecastN4Linea[]): ForecastFlatN7Row[] {
  return lineas.flatMap((n4) => n4.n7.map((n7) => ({ n4Codigo: n4.n4Codigo, n4Nombre: n4.n4Nombre, n7, n4Siblings: n4.n7 })))
}
