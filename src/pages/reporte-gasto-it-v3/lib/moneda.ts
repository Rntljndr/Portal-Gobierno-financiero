import { paisMoneda, paisTasaCambioPromedio } from '@/data/services'
import type { V3Pais } from '@/data/gasto-it-v3'

/** Misma regla que el módulo de Presupuesto: "Destino USD" consolida todo en dólares y siempre se puede
 * totalizar. "Origen ML" y "Destino ML" muestran la moneda local de un país: sin una moneda común no se
 * puede totalizar, por eso solo se ofrecen cuando hay un único país seleccionado. Los datos viven en USD y
 * se convierten al mostrar con la tasa promedio del presupuesto. */
export type VistaMoneda = 'usd' | 'origen' | 'destino'

/** Mismo orden y rótulos que el selector "Ver montos por" del Reporte Negocio (`currencyViews`). */
export const VISTAS_MONEDA: { value: VistaMoneda; label: string }[] = [
  { value: 'origen', label: 'Origen ML' },
  { value: 'destino', label: 'Destino ML' },
  { value: 'usd', label: 'Destino USD' },
]

export interface Moneda {
  code: string
  /** Unidades de esta moneda por 1 USD. */
  tasa: number
}

export const USD: Moneda = { code: 'USD', tasa: 1 }

export function monedaDePais(pais: V3Pais): Moneda {
  return { code: paisMoneda[pais], tasa: paisTasaCambioPromedio[pais] ?? 1 }
}

/** La moneda local solo aplica con un país seleccionado; con "Todos los países" siempre se totaliza en USD. */
export const monedaLocalDisponible = (pais: V3Pais | 'todos') => pais !== 'todos'

export function monedaDe(vista: VistaMoneda, pais: V3Pais | 'todos'): Moneda {
  if (vista === 'usd' || pais === 'todos') return USD
  return monedaDePais(pais)
}
