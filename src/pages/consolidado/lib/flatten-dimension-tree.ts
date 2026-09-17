import type { DimNode } from './build-dimension-tree'

export interface DimFlatRow {
  key: string
  depth: number
  node: DimNode
  hasChildren: boolean
  isOpen: boolean
  onToggle?: () => void
}

interface FlattenArgs {
  tree: DimNode[]
  expanded: Record<string, boolean>
  onToggle: (key: string) => void
  /** Cantidad de niveles de agrupación de la dimensión activa (varía entre 2 y 4 según la pestaña);
   * los nodos en este depth son siempre la hoja PEP N4 y nunca se abren. */
  maxDepth: number
}

/** Recorre un árbol de profundidad variable (2 a 4 niveles de agrupación + hoja PEP N4), abriendo
 * solo las ramas marcadas en `expanded`, sin asumir una cantidad fija de niveles. */
export function flattenDimensionTree({ tree, expanded, onToggle, maxDepth }: FlattenArgs): DimFlatRow[] {
  const rows: DimFlatRow[] = []

  function walk(nodes: DimNode[], depth: number, prefix: string) {
    const isLeafLevel = depth === maxDepth
    for (const node of nodes) {
      const key = prefix ? `${prefix}|${node.nombre}` : node.nombre
      const isOpen = !isLeafLevel && !!expanded[key]
      rows.push({
        key,
        depth,
        node,
        hasChildren: !isLeafLevel && node.children.length > 0,
        isOpen,
        onToggle: isLeafLevel ? undefined : () => onToggle(key),
      })
      if (isOpen) walk(node.children, depth + 1, key)
    }
  }

  walk(tree, 0, '')
  return rows
}
