import type { PepN4Row } from '@/data/peps'

export type SortColumn = 'pep' | 'pais' | 'moneda' | 'cod' | 'servicio' | 'area' | 'cuenta' | 'fechaCreacion' | 'ultimaEdicion' | null
export type SortDir = 'asc' | 'desc' | null

function sortValue(r: PepN4Row, col: SortColumn): string {
  if (!col) return ''
  if (col === 'ultimaEdicion') return r.ultimaEdicion.fecha
  return r[col]
}

export function sortPeps(items: PepN4Row[], col: SortColumn, dir: SortDir): PepN4Row[] {
  if (!col || !dir) return items
  return [...items].sort((a, b) => {
    const c = sortValue(a, col).localeCompare(sortValue(b, col), 'es', { numeric: true })
    return dir === 'asc' ? c : -c
  })
}

export function nextSort(current: SortColumn, currentDir: SortDir, col: NonNullable<SortColumn>): { col: SortColumn; dir: SortDir } {
  if (current !== col) return { col, dir: 'asc' }
  if (currentDir === 'asc') return { col, dir: 'desc' }
  return { col: null, dir: null }
}
