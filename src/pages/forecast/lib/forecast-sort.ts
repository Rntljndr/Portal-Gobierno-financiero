import { useEffect, useState } from 'react'
import type { ResumenTotals } from '@/shared/lib/resumen-blocks'

export type ForecastSortCol = 'nombre' | 'real' | 'desvioAcumMonto' | 'desvioAcumPct' | 'realMasForecast' | 'desvio' | 'pctDesvio' | null

export type SortDir = 'asc' | 'desc'

export function sortForecastRows<T>(rows: T[], col: ForecastSortCol, dir: SortDir, nombreOf: (r: T) => string, totalsOf: (r: T) => ResumenTotals): T[] {
  if (!col) return rows
  return [...rows].sort((a, b) => {
    const cmp = col === 'nombre' ? nombreOf(a).localeCompare(nombreOf(b), 'es') : (totalsOf(a)[col] ?? 0) - (totalsOf(b)[col] ?? 0)
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

  const onSort = (c: NonNullable<ForecastSortCol>) => {
    if (col !== c) {
      setCol(c)
      setDir('desc')
    } else {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  return { col, dir, onSort }
}
