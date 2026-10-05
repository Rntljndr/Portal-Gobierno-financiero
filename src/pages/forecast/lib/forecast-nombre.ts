import { REALES_LAST_CLOSED } from '@/data/reales'
import type { ForecastRound } from '@/data/forecast'

/** A1: nomenclatura oficial `Forecast [año] [real]+[proyección] – v[n]`. [real] sale de
 * `REALES_LAST_CLOSED` (única fuente real de "meses cerrados" del sistema — `FORECAST_MES_ACTUAL` es
 * una constante local de Forecast, independiente y no necesariamente sincronizada). */
export function forecastCorte(fecha: Date = new Date()): { anio: number; real: number; proyeccion: number } {
  const anio = fecha.getFullYear()
  const real = REALES_LAST_CLOSED
  return { anio, real, proyeccion: 12 - real }
}

/** Próxima versión para un mismo corte [real]+[proyección] en el año: v1 si no hay ningún forecast
 * previo (de cualquier estado) con ese prefijo exacto; si hay v1/v2, propone v3. Un corte distinto
 * (otro mes de cierre) siempre vuelve a empezar en v1, al tener otro prefijo. */
export function forecastSiguienteVersion(rounds: ForecastRound[], prefijo: string): number {
  const versiones = rounds
    .map((r) => (r.titulo.startsWith(prefijo) ? Number(r.titulo.slice(prefijo.length)) : NaN))
    .filter((n) => Number.isInteger(n) && n > 0)
  return versiones.length ? Math.max(...versiones) + 1 : 1
}

/** Nombre propuesto por el sistema al abrir "Nuevo Forecast" — queda como valor inicial editable del
 * campo Título (F: "el valor sugerido debe seguir siempre la convención", pero el usuario puede
 * modificarlo libremente). */
export function forecastNombreSugerido(rounds: ForecastRound[], fecha: Date = new Date()): string {
  const { anio, real, proyeccion } = forecastCorte(fecha)
  const prefijo = `Forecast ${anio} ${real}+${proyeccion} – v`
  return `${prefijo}${forecastSiguienteVersion(rounds, prefijo)}`
}
