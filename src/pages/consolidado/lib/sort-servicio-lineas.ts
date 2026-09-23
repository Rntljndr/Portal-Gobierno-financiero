import type { ServicioLineaRow } from './consolidado-servicio-lineas'

export type ServicioSortCol = keyof Omit<ServicioLineaRow, 'key'> | null
export type SortDir = 'asc' | 'desc'

const NUMERIC_COLUMNS = new Set<ServicioSortCol>(['plan', 'forecastIPC', 'varMonto', 'varPct', 'hcPlan'])

export function sortServicioLineas(rows: ServicioLineaRow[], col: ServicioSortCol, dir: SortDir): ServicioLineaRow[] {
  if (!col) return rows
  const sorted = [...rows].sort((a, b) => {
    const va = a[col]
    const vb = b[col]
    const cmp = NUMERIC_COLUMNS.has(col) ? Number(va) - Number(vb) : String(va).localeCompare(String(vb), 'es')
    return dir === 'asc' ? cmp : -cmp
  })
  return sorted
}
