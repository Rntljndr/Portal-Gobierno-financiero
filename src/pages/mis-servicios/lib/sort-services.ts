import type { Servicio } from '@/data/services'

export type SortColumn = 'pais' | 'equipo' | 'tipoOrigen' | 'dolarizado' | null
export type SortDir = 'asc' | 'desc' | null

function sortValue(s: Servicio, col: SortColumn): string {
  if (col === 'dolarizado') return s.moneda === 'USD' ? 'sí' : 'no'
  if (col === 'pais' || col === 'equipo' || col === 'tipoOrigen') return s[col]
  return ''
}

export function sortServices(items: Servicio[], col: SortColumn, dir: SortDir): Servicio[] {
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
