import type { PreliminarRow } from '@/data/preliminares'
import { MONEDA_POR_PAIS, REALES_PAISES } from '@/pages/reales/lib/reales-by-country'
import { prelimFmt, sumPrelimRowTotals } from './preliminares-calc'

export { REALES_PAISES as PRELIM_PAISES }

export interface PrelimCountryRow {
  pais: string
  moneda: string
  empty: boolean
  preliminarMes: string
  planMes: string
  forecastMes: string
  desvioMonto: string
  desvioPct: string
  over: boolean
}

type PrelimRow = Pick<PreliminarRow, 'meses' | 'acumReal' | 'forecastMes' | 'preliminarMes'> & { pais: string }

/** Agrupa filas de Preliminares (N4 o N7) por país y calcula Preliminar, Plan, Forecast y Desvío del mes de cada uno.
 * `zeroFill`: en vez de marcar "Sin datos" a los países sin participación, muestra sus métricas en 0. */
export function preliminaresByCountry(rows: PrelimRow[], paisesList: string[] = REALES_PAISES, zeroFill = false): PrelimCountryRow[] {
  return paisesList.map((pais) => {
    const items = rows.filter((r) => r.pais === pais)
    const moneda = MONEDA_POR_PAIS[pais] ?? pais.toUpperCase()
    if (items.length === 0 && !zeroFill) {
      return { pais, moneda, empty: true, preliminarMes: '—', planMes: '—', forecastMes: '—', desvioMonto: '—', desvioPct: '—', over: false }
    }
    const t = sumPrelimRowTotals(items)
    const over = t.desvioPlanMonto > 0
    const pct = t.desvioPlanPct ?? 0
    return {
      pais,
      moneda,
      empty: false,
      preliminarMes: prelimFmt(t.preliminarMes, 'USD'),
      planMes: prelimFmt(t.planMes, 'USD'),
      forecastMes: prelimFmt(t.forecastMes, 'USD'),
      desvioMonto: `${over ? '+' : ''}${prelimFmt(t.desvioPlanMonto, 'USD')}`,
      desvioPct: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
      over,
    }
  })
}
