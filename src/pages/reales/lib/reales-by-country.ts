import type { RealesRow } from '@/data/reales'
import { fmtReales, sumTotals } from './reales-calc'

export interface RealesCountryRow {
  pais: string
  moneda: string
  empty: boolean
  real: string
  planAcum: string
  desvioMonto: string
  desvioPct: string
  over: boolean
}

/** Todos los países del portal (incluye Uruguay y Estados Unidos, sin PEPs propios en Reales hoy). */
export const REALES_PAISES = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú', 'Uruguay', 'Estados Unidos']

export const MONEDA_POR_PAIS: Record<string, string> = {
  Argentina: 'ARS', Brasil: 'BRL', Chile: 'CLP', Colombia: 'COP', Perú: 'PEN', Uruguay: 'UYU', 'Estados Unidos': 'USD',
}

/** Agrupa filas de Reales (N4 o N7) por país y calcula Real acum., Plan acum., Desvío $ y Desvío % de cada uno.
 * `zeroFill`: en vez de marcar "Sin datos" a los países sin participación, muestra sus métricas en 0. */
export function realesByCountry(
  rows: Pick<RealesRow, 'pais' | 'meses' | 'planFactor'>[],
  paisesList: string[],
  currency: string,
  zeroFill = false,
): RealesCountryRow[] {
  return paisesList.map((pais) => {
    const items = rows.filter((r) => r.pais === pais)
    const moneda = MONEDA_POR_PAIS[pais] ?? pais.toUpperCase()
    if (items.length === 0 && !zeroFill) {
      return { pais, moneda, empty: true, real: '—', planAcum: '—', desvioMonto: '—', desvioPct: '—', over: false }
    }
    const t = sumTotals(items)
    const over = t.desvioAcumMonto > 0
    const pct = t.desvioAcumPct ?? 0
    return {
      pais,
      moneda,
      empty: false,
      real: fmtReales(t.real, currency),
      planAcum: fmtReales(t.planAcum, currency),
      desvioMonto: `${over ? '+' : ''}${fmtReales(t.desvioAcumMonto, currency)}`,
      desvioPct: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
      over,
    }
  })
}
