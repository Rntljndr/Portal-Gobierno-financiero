import { pepN4Tablon } from '@/data/reporteria'

export interface ForecastEquipoOption {
  equipo: string
  n4Codigos: string[]
}

/** Equipos disponibles para habilitar un Forecast Parcial (F: "solamente debe aparecer un listado de
 * los equipos para poder habilitar el forecast para que esos equipos lo puedan editar") — un equipo
 * habilita TODOS los servicios N4 que le pertenecen, no un N4 puntual. */
export const FORECAST_EQUIPO_OPTIONS: ForecastEquipoOption[] = [...new Set(pepN4Tablon.map((n4) => n4.equipo).filter(Boolean))]
  .sort((a, b) => a.localeCompare(b, 'es'))
  .map((equipo) => ({ equipo, n4Codigos: pepN4Tablon.filter((n4) => n4.equipo === equipo).map((n4) => n4.codigo) }))

export function n4CodesForEquipos(equipos: Set<string>): string[] {
  return FORECAST_EQUIPO_OPTIONS.filter((e) => equipos.has(e.equipo)).flatMap((e) => e.n4Codigos)
}

/** Reconstruye qué equipos quedaron habilitados a partir de los códigos N4 guardados en el round —
 * solo cuenta un equipo como habilitado si TODOS sus N4 están en el set (selección siempre es por
 * equipo completo, nunca parcial dentro de un equipo). */
export function equiposFromN4Codes(codigos: string[]): Set<string> {
  const set = new Set(codigos)
  return new Set(FORECAST_EQUIPO_OPTIONS.filter((e) => e.n4Codigos.length > 0 && e.n4Codigos.every((c) => set.has(c))).map((e) => e.equipo))
}
