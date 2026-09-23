import type { DimNode } from './build-dimension-tree'
import { computeDimMetrics } from './dimension-metrics'

export type DimSortCol = 'nombre' | 'plan' | 'fIPC' | 'varMonto' | 'varPct' | 'pctPlan' | null

export type SortDir = 'asc' | 'desc'

function valueFor(node: DimNode, col: NonNullable<DimSortCol>, totalPlanFiltrado: number): string | number {
  if (col === 'nombre') return node.nombre
  if (col === 'plan' || col === 'fIPC') return node[col]
  return computeDimMetrics(node, totalPlanFiltrado)[col]
}

function sortNodes(nodes: DimNode[], col: NonNullable<DimSortCol>, dir: SortDir, totalPlanFiltrado: number): DimNode[] {
  return [...nodes]
    .sort((a, b) => {
      const va = valueFor(a, col, totalPlanFiltrado)
      const vb = valueFor(b, col, totalPlanFiltrado)
      const cmp = col === 'nombre' ? String(va).localeCompare(String(vb), 'es') : Number(va) - Number(vb)
      return dir === 'asc' ? cmp : -cmp
    })
    .map((n) => (n.children.length ? { ...n, children: sortNodes(n.children, col, dir, totalPlanFiltrado) } : n))
}

/** Ordena cada nivel del árbol (cualquiera sea su profundidad: 2 a 4 niveles según la pestaña) de
 * forma independiente por la misma columna — sortear por Plan reordena el primer nivel entre sí y
 * también cada grupo interno, hasta las hojas PEP N4/Servicio. */
export function sortDimTree(tree: DimNode[], col: DimSortCol, dir: SortDir, totalPlanFiltrado: number): DimNode[] {
  if (!col) return tree
  return sortNodes(tree, col, dir, totalPlanFiltrado)
}
