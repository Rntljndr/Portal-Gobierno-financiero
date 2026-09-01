import type { PepN7Row } from '@/data/peps'

export type N7SortColumn = 'servicio' | 'cod' | 'bandera' | 'destino' | 'ceco' | null
export type N7SortDir = 'asc' | 'desc' | null

export function sortPepN7(items: PepN7Row[], col: N7SortColumn, dir: N7SortDir): PepN7Row[] {
  if (!col || !dir) return items
  return [...items].sort((a, b) => {
    const c = a[col].localeCompare(b[col], 'es', { numeric: true })
    return dir === 'asc' ? c : -c
  })
}

export function nextN7Sort(current: N7SortColumn, currentDir: N7SortDir, col: NonNullable<N7SortColumn>): { col: N7SortColumn; dir: N7SortDir } {
  if (current !== col) return { col, dir: 'asc' }
  if (currentDir === 'asc') return { col, dir: 'desc' }
  return { col: null, dir: null }
}
