import type { ForecastRound } from '@/data/forecast'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'

/** Forecasts elegibles para comparar (M3/Comparar) — cualquier cerrado distinto del que se está
 * viendo y del mismo año que él (F: "solo se cargan los forecast del mismo año"), más reciente
 * primero. No se reutiliza reales/lib/forecast-comparison.ts a propósito: los módulos de pages/ no se
 * importan entre sí (ver forecast-chart-scale.ts). */
export function forecastAnterioresOptions(rounds: ForecastRound[], roundActual: ForecastRound): ForecastRound[] {
  const anio = roundActual.fechaInicio.slice(0, 4)
  return rounds
    .filter((r) => r.estado === 'Cerrado' && r.id !== roundActual.id && r.fechaInicio.slice(0, 4) === anio)
    .sort((a, b) => (a.fechaTermino < b.fechaTermino ? 1 : -1))
}

/** Línea N7 equivalente (mismo n4Codigo/n7Codigo) dentro de un forecast anterior — undefined si ese
 * PEP no existía ahí (composición distinta de servicios entre forecasts). */
export function findN7EnRound(round: ForecastRound, n4Codigo: string, n7Codigo: string): ForecastN7Linea | undefined {
  return round.lineas.find((n4) => n4.n4Codigo === n4Codigo)?.n7.find((n7) => n7.n7Codigo === n7Codigo)
}

/** Línea N4 equivalente dentro de un forecast anterior — mismo criterio que findN7EnRound, para la
 * fila de comparación "Forecast anterior" de las tablas N4. */
export function findN4EnRound(round: ForecastRound, n4Codigo: string): ForecastN4Linea | undefined {
  return round.lineas.find((n4) => n4.n4Codigo === n4Codigo)
}
