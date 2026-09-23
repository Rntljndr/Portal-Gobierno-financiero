import type { DireccionPais, DireccionLeaf } from '@/data/reporte-direccion'
import { computeDireccionMetrics } from './direccion-metrics'

export type DireccionSortCol =
  | 'nombre'
  | 'real'
  | 'sIngresosReal'
  | 'plan'
  | 'sIngresosPlan'
  | 'varVsPlan'
  | 'varPct'
  | 'realAnterior'
  | 'sIngresosAnterior'
  | 'varAA'
  | 'varAAPct'
  | null

export type SortDir = 'asc' | 'desc'

function valueFor(node: DireccionLeaf, col: NonNullable<DireccionSortCol>): string | number {
  if (col === 'nombre') return node.nombre
  if (col === 'real' || col === 'plan' || col === 'realAnterior') return node[col]
  return computeDireccionMetrics(node)[col]
}

function sortLeaves<T extends DireccionLeaf>(nodes: T[], col: NonNullable<DireccionSortCol>, dir: SortDir): T[] {
  return [...nodes].sort((a, b) => {
    const va = valueFor(a, col)
    const vb = valueFor(b, col)
    const cmp = col === 'nombre' ? String(va).localeCompare(String(vb), 'es') : Number(va) - Number(vb)
    return dir === 'asc' ? cmp : -cmp
  })
}

/** Ordena cada nivel del árbol (país, división, bandera) de forma independiente por la misma
 * columna — sortear por Total Plan reordena los países entre sí, y también las divisiones dentro
 * de cada país, y las banderas dentro de cada división. */
export function sortDireccionTree(tree: DireccionPais[], col: DireccionSortCol, dir: SortDir): DireccionPais[] {
  if (!col) return tree
  return sortLeaves(tree, col, dir).map((pais) => ({
    ...pais,
    divisiones: sortLeaves(pais.divisiones, col, dir).map((division) => ({
      ...division,
      banderas: sortLeaves(division.banderas, col, dir),
    })),
  }))
}
