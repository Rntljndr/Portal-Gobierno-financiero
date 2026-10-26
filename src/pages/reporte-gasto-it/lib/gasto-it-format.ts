// ---------------------------------------------------------------------------
// Formato (USD, coma decimal CL)
// ---------------------------------------------------------------------------

const dec1 = (n: number) => n.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** "US$ 12,4 M" / "US$ 850 K" — con signo explícito si `signed`. */
export function fmtUSD(n: number, signed = false): string {
  const abs = Math.abs(n)
  const sign = signed ? (n > 0 ? '+' : n < 0 ? '−' : '') : n < 0 ? '−' : ''
  if (abs >= 1e6) return `${sign}US$ ${dec1(abs / 1e6)} M`
  if (abs >= 1e3) return `${sign}US$ ${Math.round(abs / 1e3).toLocaleString('es-CL')} K`
  return `${sign}US$ ${Math.round(abs).toLocaleString('es-CL')}`
}

export function fmtPct(n: number, signed = false, decimals = 1): string {
  // Un valor que redondea a cero no lleva signo (evita "−0,0 %").
  if (Math.abs(n) < 0.5 * 10 ** -decimals) n = 0
  const sign = signed ? (n > 0 ? '+' : n < 0 ? '−' : '') : n < 0 ? '−' : ''
  return `${sign}${Math.abs(n).toLocaleString('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} %`
}
