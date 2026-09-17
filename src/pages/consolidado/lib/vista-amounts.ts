import { getDestinos, convertMoneda, type Servicio, type Pais } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'

export { requierePaisUnico } from '@/data/reporteria'

export interface Fragment {
  pais: Pais
  plan: number
  fBase: number
  fIPC: number
}

/**
 * Reparte un servicio según la vista de moneda:
 * - 'origen': sin reparto, 100% en el país que origina el gasto, en su moneda.
 * - 'destino': reparte según los `destinos` declarados, cada fracción en la moneda de su país destino.
 * - 'dolar': igual reparto, cada fracción convertida a USD.
 *
 * `paisMoneda`, si viene informado, acota a un solo país (igual al real: en Origen ML/Destino ML hay
 * que elegir un país porque no existe una moneda común entre países sin convertir — solo Destino USD
 * puede consolidar varios a la vez). En 'origen' descarta el servicio si no es de ese país; en
 * 'destino' se queda solo con la fracción de ese país destino.
 */
export function fragmentsFor(s: Servicio, vista: CurrencyView, paisMoneda?: Pais | null): Fragment[] {
  if (vista === 'origen') {
    if (paisMoneda && s.pais !== paisMoneda) return []
    return [{ pais: s.pais, plan: s.totalPlan, fBase: s.forecastBase, fIPC: s.forecastIPC }]
  }
  const fragments = getDestinos(s).map((d) => {
    const frac = d.pct / 100
    const to: Pais = vista === 'dolar' ? 'Estados Unidos' : d.pais
    return {
      pais: d.pais,
      plan: Math.round(convertMoneda(s.totalPlan * frac, s.pais, to)),
      fBase: Math.round(convertMoneda(s.forecastBase * frac, s.pais, to)),
      fIPC: Math.round(convertMoneda(s.forecastIPC * frac, s.pais, to)),
    }
  })
  return vista === 'destino' && paisMoneda ? fragments.filter((f) => f.pais === paisMoneda) : fragments
}

export function totalsFor(servicios: Servicio[], vista: CurrencyView, paisMoneda?: Pais | null): { plan: number; fBase: number; fIPC: number } {
  const acc = { plan: 0, fBase: 0, fIPC: 0 }
  for (const s of servicios) {
    for (const frag of fragmentsFor(s, vista, paisMoneda)) {
      acc.plan += frag.plan
      acc.fBase += frag.fBase
      acc.fIPC += frag.fIPC
    }
  }
  return acc
}
