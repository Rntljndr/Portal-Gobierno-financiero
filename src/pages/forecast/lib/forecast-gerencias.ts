import { pepN4Tablon } from '@/data/reporteria'
import { pepN4Meta } from '@/data/pep-n4-meta'
import { FORECAST_EQUIPO_OPTIONS } from './forecast-equipos'

export interface ForecastGerenciaOption {
  gerencia: string
  n4Codigos: string[]
}

/** Gerencias disponibles para habilitar un Forecast Parcial (F: "se habilitan 2 nuevos campos para
 * hacer una selección múltiple que son de gerencias y equipos") — mismo patrón que
 * FORECAST_EQUIPO_OPTIONS, pero agrupando por `gerencia` (pepN4Meta) en vez de por `equipo`
 * (pepN4Tablon); una gerencia habilita TODOS los servicios N4 que le pertenecen. */
export const FORECAST_GERENCIA_OPTIONS: ForecastGerenciaOption[] = [...new Set(pepN4Tablon.map((n4) => pepN4Meta[n4.codigo]?.gerencia).filter((g): g is string => !!g))]
  .sort((a, b) => a.localeCompare(b, 'es'))
  .map((gerencia) => ({ gerencia, n4Codigos: pepN4Tablon.filter((n4) => pepN4Meta[n4.codigo]?.gerencia === gerencia).map((n4) => n4.codigo) }))

export function n4CodesForGerencias(gerencias: Set<string>): string[] {
  return FORECAST_GERENCIA_OPTIONS.filter((g) => gerencias.has(g.gerencia)).flatMap((g) => g.n4Codigos)
}

/** F: "al lado derecho de este campo se habilita otro dropdown con los equipos, dependiendo de la
 * gerencia que has habilitado" — sin ninguna gerencia marcada se ofrecen todos los equipos; con una o
 * más, se acota a los que tienen al menos un servicio N4 bajo esas gerencias. */
export function equiposDisponiblesParaGerencias(gerencias: Set<string>): string[] {
  if (gerencias.size === 0) return FORECAST_EQUIPO_OPTIONS.map((e) => e.equipo)
  const n4s = new Set(n4CodesForGerencias(gerencias))
  return FORECAST_EQUIPO_OPTIONS.filter((e) => e.n4Codigos.some((c) => n4s.has(c))).map((e) => e.equipo)
}

/** Reconstruye qué gerencias quedaron habilitadas a partir de los códigos N4 guardados en el round —
 * mismo criterio que `equiposFromN4Codes`: solo cuenta como habilitada si TODOS sus N4 están en el set. */
export function gerenciasFromN4Codes(codigos: string[]): Set<string> {
  const set = new Set(codigos)
  return new Set(FORECAST_GERENCIA_OPTIONS.filter((g) => g.n4Codigos.length > 0 && g.n4Codigos.every((c) => set.has(c))).map((g) => g.gerencia))
}
