export function prelimFmt(n: number, moneda: string): string {
  if (moneda === 'USD') return `$${Math.round(n / 1000).toLocaleString('es-CL')}K`
  if (moneda === 'COP' || moneda === 'CLP') return `${Math.round(n / 1_000_000).toLocaleString('es-CL')}M`
  return `${Math.round(n / 1000).toLocaleString('es-CL')}K`
}

export function prelimPct(preliminar: number, forecast: number): number | null {
  if (!forecast) return null
  return (preliminar / forecast) * 100
}
