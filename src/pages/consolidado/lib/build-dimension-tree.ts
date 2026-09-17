import type { Servicio, Pais } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { fragmentsFor } from './vista-amounts'
import { DIMENSION_LEVELS, type DimensionKey } from './dimensiones'

export interface DimNode {
  nombre: string
  codigo?: string
  plan: number
  fBase: number
  fIPC: number
  children: DimNode[]
}

type GroupMap = Map<string, GroupMap | Map<string, DimNode>>

function sumNodes(nodes: DimNode[]): Pick<DimNode, 'plan' | 'fBase' | 'fIPC'> {
  return nodes.reduce((acc, n) => ({ plan: acc.plan + n.plan, fBase: acc.fBase + n.fBase, fIPC: acc.fIPC + n.fIPC }), { plan: 0, fBase: 0, fIPC: 0 })
}

const byPlanDesc = (a: DimNode, b: DimNode) => b.plan - a.plan

function addFragmentToLeaf(leaves: Map<string, DimNode>, s: Servicio, frag: { plan: number; fBase: number; fIPC: number }) {
  const leaf = leaves.get(s.id) ?? { nombre: s.nombre, codigo: s.pep, plan: 0, fBase: 0, fIPC: 0, children: [] }
  leaf.plan += frag.plan
  leaf.fBase += frag.fBase
  leaf.fIPC += frag.fIPC
  leaves.set(s.id, leaf)
}

function buildLevel(map: GroupMap, depth: number, maxDepth: number): DimNode[] {
  const isLastGroup = depth === maxDepth - 1
  return [...map.entries()]
    .map(([nombre, sub]) => {
      const children = isLastGroup
        ? [...(sub as Map<string, DimNode>).values()].sort(byPlanDesc)
        : buildLevel(sub as GroupMap, depth + 1, maxDepth)
      return { nombre, children, ...sumNodes(children) }
    })
    .sort(byPlanDesc)
}

/**
 * Cada dimensión define su propia cadena de niveles en `DIMENSION_LEVELS` (2 a 4 niveles de
 * agrupación según la pestaña) antes de llegar siempre al PEP N4 como hoja final.
 */
export function buildDimensionTree(servicios: Servicio[], dim: DimensionKey, vista: CurrencyView, paisMoneda?: Pais | null): DimNode[] {
  const levels = DIMENSION_LEVELS[dim]
  const root: GroupMap = new Map()

  for (const s of servicios) {
    for (const frag of fragmentsFor(s, vista, paisMoneda)) {
      let map = root
      for (let i = 0; i < levels.length - 1; i++) {
        const key = levels[i].keyFn(s, frag)
        const next = (map.get(key) as GroupMap | undefined) ?? new Map()
        map.set(key, next)
        map = next as GroupMap
      }
      const lastKey = levels[levels.length - 1].keyFn(s, frag)
      const leaves = (map.get(lastKey) as Map<string, DimNode> | undefined) ?? new Map<string, DimNode>()
      map.set(lastKey, leaves)
      addFragmentToLeaf(leaves, s, frag)
    }
  }

  return buildLevel(root, 0, levels.length)
}

export function sumDimNodes(nombre: string, nodes: DimNode[]): DimNode {
  return { nombre, children: [], ...sumNodes(nodes) }
}

export function countLeaves(node: DimNode): number {
  if (node.children.length === 0) return node.codigo ? 1 : 0
  return node.children.reduce((a, c) => a + countLeaves(c), 0)
}
