import type { ForecastRound } from '@/data/forecast'

export interface ForecastAnterioresFilters {
  anio: string
  mes: string
  busqueda: string
}

export const EMPTY_ANTERIORES_FILTERS: ForecastAnterioresFilters = { anio: '', mes: '', busqueda: '' }

/** Años disponibles entre los forecasts dados, para el filtro del drawer de Anteriores (F). */
export function anteriorAnios(rounds: ForecastRound[]): string[] {
  const anios = new Set<string>()
  rounds.forEach((r) => {
    for (let y = Number(r.fechaInicio.slice(0, 4)); y <= Number(r.fechaTermino.slice(0, 4)); y++) anios.add(String(y))
  })
  return [...anios].sort((a, b) => Number(b) - Number(a))
}

function coversYearMonth(round: ForecastRound, yyyyMm: string): boolean {
  return round.fechaInicio.slice(0, 7) <= yyyyMm && round.fechaTermino.slice(0, 7) >= yyyyMm
}

/** Filtra por año (¿el rango del forecast toca ese año?), mes dentro de ese año (mismo criterio, más
 * específico) y nombre — el orden año → mes → buscador que pide F, para encontrar "el forecast de los
 * meses" entre potencialmente muchos anteriores. */
export function applyAnterioresFilters(rounds: ForecastRound[], f: ForecastAnterioresFilters): ForecastRound[] {
  return rounds.filter((r) => {
    if (f.anio) {
      const inicioY = Number(r.fechaInicio.slice(0, 4))
      const terminoY = Number(r.fechaTermino.slice(0, 4))
      if (Number(f.anio) < inicioY || Number(f.anio) > terminoY) return false
    }
    if (f.mes && f.anio && !coversYearMonth(r, `${f.anio}-${f.mes}`)) return false
    if (f.busqueda && !r.titulo.toLowerCase().includes(f.busqueda.toLowerCase())) return false
    return true
  })
}
