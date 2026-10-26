/** `svg` = clase de relleno para gráficos SVG; `fondo` = clase de fondo en HTML (ambas de tokens).
 *
 * Regla de color de todo el portal para cifras con signo (desvíos, variaciones, diferencias): positivo
 * = rojo (más gasto), negativo = verde (menos gasto) y gris solo cuando el valor mostrado es 0. El color
 * nunca va solo: siempre lleva signo e ícono (▲ sube, ▼ baja, ● sin cambio). La tolerancia de "Ajustes"
 * se usa para priorizar (focos, desde qué mes nace un desvío), no para colorear. */

export type Estado = 'sobre' | 'tolerancia' | 'bajo'

export const TOLERANCIAS = [1, 2, 3, 5]
export const TOLERANCIA_DEFAULT = 2

/** Estado por signo del valor tal como se muestra (1 decimal): 0,0 % es gris; cualquier otro, rojo o verde. */
export function estadoSigno(n: number): Estado {
  if (n >= 0.05) return 'sobre'
  if (n <= -0.05) return 'bajo'
  return 'tolerancia'
}

/** Clase de color de texto para una cifra con signo (misma regla que estadoSigno). */
export const claseSigno = (n: number) => ESTADO_META[estadoSigno(n)].texto

export function estadoDe(pct: number, tol: number): Estado {
  if (pct > tol) return 'sobre'
  if (pct < -tol) return 'bajo'
  return 'tolerancia'
}

export const ESTADO_META: Record<Estado, { label: string; simbolo: string; badge: 'destructive' | 'success' | 'neutral'; texto: string; svg: string; fondo: string }> = {
  sobre: { label: 'Sobre plan', simbolo: '▲', badge: 'destructive', texto: 'text-destructive', svg: 'fill-destructive', fondo: 'bg-destructive' },
  tolerancia: { label: 'Sin desvío', simbolo: '●', badge: 'neutral', texto: 'text-muted-foreground', svg: 'fill-text-disabled', fondo: 'bg-text-disabled' },
  bajo: { label: 'Bajo plan', simbolo: '▼', badge: 'success', texto: 'text-success', svg: 'fill-success', fondo: 'bg-success' },
}
