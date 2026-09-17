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
  expandedL1: Record<string, boolean>
  onToggleL1: (key: string) => void
  expandedL2: Record<string, boolean>
  onToggleL2: (key: string) => void
}

export function flattenDimensionTree({ tree, expandedL1, onToggleL1, expandedL2, onToggleL2 }: FlattenArgs): DimFlatRow[] {
  const rows: DimFlatRow[] = []

  for (const l1 of tree) {
    const l1Open = !!expandedL1[l1.nombre]
    rows.push({
      key: l1.nombre,
      depth: 0,
      node: l1,
      hasChildren: l1.children.length > 0,
      isOpen: l1Open,
      onToggle: () => onToggleL1(l1.nombre),
    })
    if (!l1Open) continue

    for (const l2 of l1.children) {
      const l2Key = `${l1.nombre}|${l2.nombre}`
      const l2Open = !!expandedL2[l2Key]
      rows.push({
        key: l2Key,
        depth: 1,
        node: l2,
        hasChildren: l2.children.length > 0,
        isOpen: l2Open,
        onToggle: () => onToggleL2(l2Key),
      })
      if (!l2Open) continue

      for (const leaf of l2.children) {
        rows.push({ key: `${l2Key}|${leaf.nombre}`, depth: 2, node: leaf, hasChildren: false, isOpen: false })
      }
    }
  }

  return rows
}
