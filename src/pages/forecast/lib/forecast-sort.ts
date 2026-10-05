import { useEffect, useState } from 'react'

/** F: "el orden con chevron solo debe llegar hasta antes del primer mes de reales" — la columna de
 * orden es "nombre" o la key de una columna de identidad (ver forecast-identity-cols.ts); los meses y
 * los totales de resumen no son ordenables. `null` = sin orden aplicado (orden natural de los datos). */
export type ForecastSortCol = string | null

export type SortDir = 'asc' | 'desc'

/** `valueOf` resuelve el valor comparable de una fila para la columna pedida — string (orden
 * alfabético, es-CL) o number (orden numérico). Un solo callback genérico en vez de nombreOf/totalsOf
 * separados, para no tener que enumerar cada columna nueva acá. */
export function sortForecastRows<T>(rows: T[], col: ForecastSortCol, dir: SortDir, valueOf: (row: T, col: string) => string | number): T[] {
  if (!col) return rows
  return [...rows].sort((a, b) => {
    const va = valueOf(a, col)
    const vb = valueOf(b, col)
    const cmp = typeof va === 'string' || typeof vb === 'string' ? String(va).localeCompare(String(vb), 'es') : va - vb
    return dir === 'asc' ? cmp : -cmp
  })
}

/** Recuerda el orden elegido por `key` (Ajuste T2) — igual patrón que `reales/lib/use-infinite-scroll.ts`
 * para recordar scroll: un Map a nivel de módulo, vive mientras dure la sesión del navegador y
 * sobrevive a que la página se desmonte al navegar N4 → N7 y volver. */
const rememberedSort = new Map<string, { col: ForecastSortCol; dir: SortDir }>()

export function useForecastSort(key: string) {
  const [col, setCol] = useState<ForecastSortCol>(() => rememberedSort.get(key)?.col ?? null)
  const [dir, setDir] = useState<SortDir>(() => rememberedSort.get(key)?.dir ?? 'desc')

  useEffect(() => {
    rememberedSort.set(key, { col, dir })
  }, [key, col, dir])

  const onSort = (c: string) => {
    if (col !== c) {
      setCol(c)
      setDir('desc')
    } else {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  return { col, dir, onSort }
}
