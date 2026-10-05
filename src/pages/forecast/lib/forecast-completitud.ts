import type { ForecastN4Linea } from '@/data/forecast-lineas'

/** % de PEP N7 de un servicio N4 que ya dejaron de estar "Abierto" (enviados, aprobados o
 * rechazados) — mismo criterio que la completitud de Preliminares (avanzados/total), adaptado al
 * envioEstado propio de Forecast en vez de un estado "Definitivo" (M6: "Estado del N4 con % de
 * completitud"). 100% solo si todos sus N7 avanzaron de estado. */
export function calcN4Completitud(n4: ForecastN4Linea): number {
  if (n4.n7.length === 0) return 0
  const avanzados = n4.n7.filter((l) => l.envioEstado !== 'Abierto').length
  return Math.round((avanzados / n4.n7.length) * 100)
}
