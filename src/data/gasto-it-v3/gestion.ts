import { V3_MESES_CERRADOS } from './catalogo'
import { rng, v3Lineas } from './lineas'

/** Datos de la Gestión del gasto (antes del cierre), por línea. DATO DE EJEMPLO.
 * - forecastAnterior: la versión de forecast cerrada el mes pasado (meses abiertos).
 * - preliminar: lo cargado en el mes en curso (aún no es real; se confirma al cierre). */
export interface V3Gestion {
  forecastAnterior: number[]
  preliminar: number
}

/** Índice del mes en curso (el primero abierto). */
export const V3_MES_EN_CURSO = Math.min(V3_MESES_CERRADOS, 11)

export const v3Gestion: Record<string, V3Gestion> = (() => {
  const rand = rng(777)
  const out: Record<string, V3Gestion> = {}
  for (const l of v3Lineas) {
    // ~60 % de las líneas no se tocan en esta versión; el resto sube o baja (más alzas que bajas).
    const cambia = rand() > 0.6
    const factor = cambia ? 0.9 + rand() * 0.26 : 1
    const forecastAnterior = l.realForecast.map((v, i) => (i < V3_MESES_CERRADOS ? v : v / factor))
    const avance = 0.45 + rand() * 0.75
    out[l.id] = { forecastAnterior, preliminar: l.realForecast[V3_MES_EN_CURSO] * avance }
  }
  return out
})()
