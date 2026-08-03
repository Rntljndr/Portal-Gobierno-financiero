export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('es-CL')
}

/** Formato compacto: 10.5M, 710K */
export function formatCompact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (abs >= 1e3) return Math.round(n / 1e3) + 'K'
  return Math.round(n).toLocaleString('es-CL')
}

/** Formato de tabla de reportería: valores ya en millones, con sufijo M / MM. */
export function formatTableAmount(v: number): string {
  const n = Math.round(Math.abs(v))
  return n >= 1000 ? `${n.toLocaleString('es-CL')} MM` : `${n.toLocaleString('es-CL')} M`
}
