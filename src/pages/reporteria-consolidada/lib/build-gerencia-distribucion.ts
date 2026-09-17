import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { fragmentsFor } from './vista-amounts'

export interface DistribucionSlice {
  nombre: string
  value: number
  pct: number
}

const TOP_N = 3

/** Top 3 gerencias + "Otros", como el donut real — más de 3 categorías visibles a la vez en un donut
 * no se puede colorear de forma segura para daltonismo (ver skill dataviz), por eso se pliega el resto. */
export function buildGerenciaDistribucion(servicios: Servicio[], vista: CurrencyView): DistribucionSlice[] {
  const byGerencia = new Map<string, number>()
  for (const s of servicios) {
    const total = fragmentsFor(s, vista).reduce((a, f) => a + f.plan, 0)
    byGerencia.set(s.gerencia, (byGerencia.get(s.gerencia) ?? 0) + total)
  }

  const sorted = [...byGerencia.entries()].sort((a, b) => b[1] - a[1])
  const grandTotal = sorted.reduce((a, [, v]) => a + v, 0) || 1
  const top = sorted.slice(0, TOP_N)
  const restoTotal = sorted.slice(TOP_N).reduce((a, [, v]) => a + v, 0)

  const slices: DistribucionSlice[] = top.map(([nombre, value]) => ({ nombre, value, pct: (value / grandTotal) * 100 }))
  if (restoTotal > 0) slices.push({ nombre: 'Otros', value: restoTotal, pct: (restoTotal / grandTotal) * 100 })
  return slices
}
