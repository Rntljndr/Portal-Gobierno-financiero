/** Umbral configurable (en puntos porcentuales) para clasificar el % de desvío en una etiqueta
 * legible (Ajuste T4) — ajustar acá si negocio define otro corte. Con el default de 5%: un desvío
 * entre -5% y +5% se considera "en ejecución" (dentro de lo esperado), más negativo es "Ahorro" y
 * más positivo es "Sobre ejecución". */
export const EJECUCION_UMBRAL_PCT = 5

export type Ejecucion = 'ahorro' | 'en-ejecucion' | 'sobre-ejecucion'

export function clasificarEjecucion(pct: number | null): Ejecucion | null {
  if (pct === null) return null
  if (pct < -EJECUCION_UMBRAL_PCT) return 'ahorro'
  if (pct > EJECUCION_UMBRAL_PCT) return 'sobre-ejecucion'
  return 'en-ejecucion'
}
