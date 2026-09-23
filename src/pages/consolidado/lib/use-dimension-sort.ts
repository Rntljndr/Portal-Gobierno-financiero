import { useMemo, useState } from 'react'
import type { DimNode } from './build-dimension-tree'
import { sortDimTree, type DimSortCol, type SortDir } from './sort-dim-tree'

/** Estado de ordenamiento por columna para el árbol de una pestaña — se reinicia manualmente al
 * cambiar de dimensión (ver `resetSort`) para no arrastrar una columna que no existe en la nueva pestaña. */
export function useDimensionSort(baseTree: DimNode[], totalPlanFiltrado: number) {
  const [sortCol, setSortCol] = useState<DimSortCol>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const tree = useMemo(() => sortDimTree(baseTree, sortCol, sortDir, totalPlanFiltrado), [baseTree, sortCol, sortDir, totalPlanFiltrado])

  const onSort = (col: NonNullable<DimSortCol>) => {
    if (sortCol !== col) {
      setSortCol(col)
      setSortDir('desc')
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  const resetSort = () => {
    setSortCol(null)
    setSortDir('desc')
  }

  return { tree, sortCol, sortDir, onSort, resetSort }
}
