import type { Moneda } from './moneda'

/** Montos abreviados en la moneda indicada: "USD 2,4 M", "CLP 2.310 M", "USD 850 K". `usd` siempre en USD. */
export function fmtMonto(usd: number, m: Moneda, signed = false): string {
  const n = usd * m.tasa
  const abs = Math.abs(n)
  const sign = signed ? (n > 0 ? '+' : n < 0 ? '−' : '') : n < 0 ? '−' : ''
  if (abs >= 1e6) {
    const mm = abs / 1e6
    return `${sign}${m.code} ${mm.toLocaleString('es-CL', { minimumFractionDigits: mm >= 100 ? 0 : 1, maximumFractionDigits: mm >= 100 ? 0 : 1 })} M`
  }
  if (abs >= 1e3) return `${sign}${m.code} ${Math.round(abs / 1e3).toLocaleString('es-CL')} K`
  return `${sign}${m.code} ${Math.round(abs).toLocaleString('es-CL')}`
}

/** Porcentaje con un decimal y coma: "4,2 %"; un valor que redondea a cero no lleva signo. */
export function fmtPct(n: number, signed = false, decimals = 1): string {
  const v = Math.abs(n) < 0.5 * 10 ** -decimals ? 0 : n
  const sign = signed ? (v > 0 ? '+' : v < 0 ? '−' : '') : v < 0 ? '−' : ''
  return `${sign}${Math.abs(v).toLocaleString('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} %`
}
