import type { Destino, Pais, Servicio } from './types'

/** Los 6 países con panel de presupuesto (Uruguay tiene servicios pero no panel propio). */
export const paises: Pais[] = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú', 'Estados Unidos']

export const paisMoneda: Record<Pais, string> = {
  Argentina: 'ARS', Brasil: 'BRL', Chile: 'CLP', Colombia: 'COP',
  'Estados Unidos': 'USD', Perú: 'PEN', Uruguay: 'UYU',
}

export const paisFlag: Record<Pais, string> = {
  Argentina: '🇦🇷', Brasil: '🇧🇷', Chile: '🇨🇱', Colombia: '🇨🇴',
  'Estados Unidos': '🇺🇸', Perú: '🇵🇪', Uruguay: '🇺🇾',
}

export const paisLabel: Record<Pais, string> = {
  Argentina: 'ARGENTINA', Brasil: 'BRASIL', Chile: 'CHILE', Colombia: 'COLOMBIA',
  'Estados Unidos': 'EEUU', Perú: 'PERÚ', Uruguay: 'URUGUAY',
}

/** Índice IPC proyectado (%) por país. */
export const paisIpc: Record<Pais, number> = {
  Argentina: 140.5, Brasil: 4.5, Chile: 3.8, Colombia: 5.2,
  'Estados Unidos': 2.9, Perú: 3.2, Uruguay: 6.1,
}

/** Tasas de cambio mensuales (moneda local por USD), usadas para convertir montos entre países. */
const tasasCambio: Partial<Record<Pais, number[]>> = {
  Argentina: [1430, 1450, 1480, 1500, 1520, 1540, 1550, 1560, 1570, 1580, 1590, 1600],
  Brasil: [4.95, 5.02, 5.08, 5.1, 5.15, 5.2, 5.18, 5.22, 5.25, 5.28, 5.3, 5.34],
  Chile: [905, 912, 920, 928, 935, 940, 948, 952, 958, 962, 968, 975],
  Colombia: [3920, 3950, 3980, 4010, 4040, 4060, 4085, 4100, 4120, 4140, 4160, 4185],
  Perú: [3.7, 3.71, 3.72, 3.74, 3.75, 3.76, 3.77, 3.78, 3.79, 3.8, 3.82, 3.84],
  'Estados Unidos': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

const tasaPromedio: Partial<Record<Pais, number>> = {}
for (const p of paises) {
  const t = tasasCambio[p]
  tasaPromedio[p] = t ? t.reduce((a, b) => a + b, 0) / t.length : 1
}

/** Convierte un monto de la moneda de `from` a la de `to`, vía USD. */
export function convertMoneda(amount: number, from: Pais, to: Pais): number {
  if (from === to) return amount
  const usd = amount / (tasaPromedio[from] ?? 1)
  return usd * (tasaPromedio[to] ?? 1)
}

/** Distribución del gasto de un servicio entre los países que impacta (100% al propio si no declara destinos). */
export function getDestinos(s: Servicio): Destino[] {
  return s.destinos && s.destinos.length ? s.destinos : [{ pais: s.pais, pct: 100 }]
}
