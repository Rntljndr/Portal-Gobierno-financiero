import { getDestinos, convertMoneda, type Servicio, type Pais } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'

export interface Fragment {
  pais: Pais
  plan: number
  fBase: number
  fIPC: number
}

/**
 * Reparte un servicio según la vista de moneda:
 * - 'origen': sin reparto, 100% en el país que origina el gasto, en su moneda.
 * - 'destino': reparte según los `destinos` declarados (o 100% al propio país si no declara), cada
 *   fracción convertida a la moneda local de su país destino.
 * - 'dolar': igual reparto que 'destino', pero cada fracción convertida a USD.
 * Reutiliza `getDestinos`/`convertMoneda`, ya definidos en el proyecto para esta distinción.
 */
export function fragmentsFor(s: Servicio, vista: CurrencyView): Fragment[] {
  if (vista === 'origen') {
    return [{ pais: s.pais, plan: s.totalPlan, fBase: s.forecastBase, fIPC: s.forecastIPC }]
  }
  return getDestinos(s).map((d) => {
    const frac = d.pct / 100
    const to: Pais = vista === 'dolar' ? 'Estados Unidos' : d.pais
    return {
      pais: d.pais,
      plan: Math.round(convertMoneda(s.totalPlan * frac, s.pais, to)),
      fBase: Math.round(convertMoneda(s.forecastBase * frac, s.pais, to)),
      fIPC: Math.round(convertMoneda(s.forecastIPC * frac, s.pais, to)),
    }
  })
}

export function totalsFor(servicios: Servicio[], vista: CurrencyView): { plan: number; fBase: number; fIPC: number } {
  const acc = { plan: 0, fBase: 0, fIPC: 0 }
  for (const s of servicios) {
    for (const frag of fragmentsFor(s, vista)) {
      acc.plan += frag.plan
      acc.fBase += frag.fBase
      acc.fIPC += frag.fIPC
    }
  }
  return acc
}
