import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '@/pages/forecast/lib/format-date'

/** Ventana de ejercicios de forecast ofrecidos para comparar: historial de los últimos 3 meses. */
export const FORECAST_COMPARISON_WINDOW_MONTHS = 3

function withinWindow(round: ForecastRound, now: Date): boolean {
  const limit = new Date(now)
  limit.setMonth(limit.getMonth() - FORECAST_COMPARISON_WINDOW_MONTHS)
  return new Date(round.fechaTermino) >= limit
}

/** Ejercicios disponibles para comparar: no-borrador, dentro de la ventana configurada. */
export function forecastComparisonOptions(rounds: ForecastRound[], now = new Date()): ForecastRound[] {
  return rounds.filter((r) => r.estado !== 'Borrador' && withinWindow(r, now))
}

/** El forecast activo por defecto: el último cerrado (referencia estable para comparar). */
export function defaultForecastRoundId(rounds: ForecastRound[]): string | null {
  const cerrados = rounds.filter((r) => r.estado === 'Cerrado').sort((a, b) => (a.fechaTermino < b.fechaTermino ? 1 : -1))
  return cerrados[0]?.id ?? null
}

function forecastRoundVersion(rounds: ForecastRound[], round: ForecastRound): number {
  const ordered = [...rounds].sort((a, b) => (a.fechaInicio < b.fechaInicio ? -1 : 1))
  return ordered.findIndex((r) => r.id === round.id) + 1
}

/** Etiqueta de una opción del listado: nombre del ejercicio + mes al que corresponde + versión. */
export function forecastRoundLabel(rounds: ForecastRound[], round: ForecastRound): string {
  return `${round.titulo} · ${formatFechaCorta(round.fechaInicio)}–${formatFechaCorta(round.fechaTermino)} · V${forecastRoundVersion(rounds, round)}`
}

/** Factor aplicado sobre el plan/real del PEP para simular su forecast, derivado del % de desvío del ejercicio elegido. */
export function forecastRoundFactor(round: ForecastRound): number {
  return 1 - round.desvio / 100
}
