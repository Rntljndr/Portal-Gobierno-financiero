import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { fragmentsFor } from './vista-amounts'
import { dimensionKeyValue, type DimensionKey } from './dimensiones'

export interface DimNode {
  nombre: string
  plan: number
  fBase: number
  fIPC: number
  count: number
  children: DimNode[]
}

function sumNodes(nodes: DimNode[]): Pick<DimNode, 'plan' | 'fBase' | 'fIPC' | 'count'> {
  return nodes.reduce(
    (acc, n) => ({ plan: acc.plan + n.plan, fBase: acc.fBase + n.fBase, fIPC: acc.fIPC + n.fIPC, count: acc.count + n.count }),
    { plan: 0, fBase: 0, fIPC: 0, count: 0 },
  )
}

const byPlanDesc = (a: DimNode, b: DimNode) => b.plan - a.plan

/**
 * Árbol de 3 niveles: dimensión elegida → Gerencia → Servicio (línea/leaf).
 * Simplificado frente al drill de 4-5 niveles del tablero real (que a su vez agrega hasta "línea PEP"
 * sobre 26.761 filas) porque este mock tiene ~40 servicios: más niveles no aportarían, solo ruido.
 */
export function buildDimensionTree(servicios: Servicio[], dim: DimensionKey, vista: CurrencyView): DimNode[] {
  const l1s = new Map<string, Map<string, Map<string, DimNode>>>()

  for (const s of servicios) {
    for (const frag of fragmentsFor(s, vista)) {
      const k1 = dimensionKeyValue(dim, s, frag)
      const l2s = l1s.get(k1) ?? new Map<string, Map<string, DimNode>>()
      l1s.set(k1, l2s)
      const leaves = l2s.get(s.gerencia) ?? new Map<string, DimNode>()
      l2s.set(s.gerencia, leaves)
      const leaf = leaves.get(s.id) ?? { nombre: s.nombre, plan: 0, fBase: 0, fIPC: 0, count: 0, children: [] }
      leaf.plan += frag.plan
      leaf.fBase += frag.fBase
      leaf.fIPC += frag.fIPC
      leaf.count += 1
      leaves.set(s.id, leaf)
    }
  }

  return [...l1s.entries()]
    .map(([k1, l2s]) => {
      const children = [...l2s.entries()]
        .map(([k2, leaves]) => {
          const leafNodes = [...leaves.values()].sort(byPlanDesc)
          return { nombre: k2, children: leafNodes, ...sumNodes(leafNodes) }
        })
        .sort(byPlanDesc)
      return { nombre: k1, children, ...sumNodes(children) }
    })
    .sort(byPlanDesc)
}

export function sumDimNodes(nombre: string, nodes: DimNode[]): DimNode {
  return { nombre, children: [], ...sumNodes(nodes) }
}
