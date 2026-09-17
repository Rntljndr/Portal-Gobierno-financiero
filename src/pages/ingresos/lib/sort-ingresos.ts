import { monthKeys } from '@/data/reporteria'
import type { IngresoRow } from './use-ingresos'

export type SortColumn = 'bandera' | 'codigo' | 'pais' | 'division' | 'total' | (typeof monthKeys)[number] | null
export type SortDir = 'asc' | 'desc'

const TEXT_COLUMNS = new Set<SortColumn>(['bandera', 'codigo', 'pais', 'division'])

function valueFor(row: IngresoRow, col: NonNullable<SortColumn>): string | number {
  if (col === 'bandera') return row.maestro.nombre
  if (col === 'codigo') return row.maestro.codigo
  if (col === 'pais') return row.maestro.pais
  if (col === 'division') return row.maestro.division
  if (col === 'total') return row.total
  return row.meses[col] ?? 0
}

export function sortIngresos(rows: IngresoRow[], col: SortColumn, dir: SortDir): IngresoRow[] {
  if (!col) return rows
  const sorted = [...rows].sort((a, b) => {
    const va = valueFor(a, col)
    const vb = valueFor(b, col)
    const cmp = TEXT_COLUMNS.has(col) ? String(va).localeCompare(String(vb), 'es') : Number(va) - Number(vb)
    return dir === 'asc' ? cmp : -cmp
  })
  return sorted
}
