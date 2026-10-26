import type { RealesRow } from '@/data/reales'
import { sumTotals, type RealesTotals } from '@/pages/reales/lib/reales-calc'
import { groupBy, ANIO_ANTERIOR_FACTOR } from '../recoe-data'
import { APERTURAS } from './dimensiones'

export interface PivotNode {
  key: string
  nombre: string
  nivelLabel: string
  totals: RealesTotals
  realAnioAnterior: number
  children: PivotNode[]
}

/** Arma el árbol anidado de la tabla dinámica del Detalle configurable, según las unidades de apertura
 * elegidas por el usuario (y su orden) — reusa el mismo `groupBy` genérico que ya usan Gerencias Cross y
 * Vista General, solo que con una cadena de niveles dinámica en vez de fija. */
export function buildPivotTree(rows: RealesRow[], aperturaIds: string[]): PivotNode[] {
  const niveles = aperturaIds.flatMap((id) => APERTURAS.find((a) => a.id === id)?.niveles ?? [])

  function recurse(rs: RealesRow[], depth: number): PivotNode[] {
    if (depth >= niveles.length) return []
    const nivel = niveles[depth]
    const grouped = groupBy(rs, nivel.keyFn)
    return [...grouped.entries()]
      .map(([nombre, group]) => {
        const totals = sumTotals(group)
        return {
          key: `${depth}·${nombre}`,
          nombre,
          nivelLabel: nivel.label,
          totals,
          realAnioAnterior: totals.real * ANIO_ANTERIOR_FACTOR,
          children: recurse(group, depth + 1),
        }
      })
      .sort((a, b) => b.totals.plan - a.totals.plan)
  }

  return recurse(rows, 0)
}

/** Aplana el árbol a filas con su profundidad — para renderizar una tabla con indentación por nivel. */
export function flattenPivotTree(nodes: PivotNode[], depth = 0): { node: PivotNode; depth: number }[] {
  return nodes.flatMap((n) => [{ node: n, depth }, ...flattenPivotTree(n.children, depth + 1)])
}
