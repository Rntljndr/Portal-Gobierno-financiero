import { useState } from 'react'
import { forecastN7Key } from './forecast-envio'
import type { useForecastFilters } from './use-forecast-filters'

/** Colapso fijo "nada colapsado, no hace nada" — para tablas de solo lectura o legacy que no ofrecen
 * comparativa (Anteriores, ForecastEditarN4Page) pero igual necesitan la prop. */
export const EMPTY_COLAPSO = { collapsed: new Set<string>(), toggle: () => {} }

/** Colapso de las filas de comparación (M7/Comparar) por línea de servicio — mismo patrón que
 * "Contraer todo"/"Expandir todo" de Reales (colapsan las RealesComparisonRow bajo cada fila, no un
 * árbol N4→N7). Reimplementado acá porque pages/<A> nunca importa de pages/<B>. */
export function useForecastColapso() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const allCollapsed = (keys: string[]) => keys.length > 0 && keys.every((k) => collapsed.has(k))
  const toggleAll = (keys: string[]) => setCollapsed(allCollapsed(keys) ? new Set() : new Set(keys))

  return { collapsed, toggle, allCollapsed, toggleAll }
}

/** Arma el colapso de la tabla activa de ForecastListBody (N4 o N7 según el tab) — mismo patrón que
 * useForecastListSeleccion, con las claves de fila de cada tab. */
export function useForecastListColapso(tab: 'n4' | 'n7', filtros: ReturnType<typeof useForecastFilters>) {
  const colapsoN4 = useForecastColapso()
  const colapsoN7 = useForecastColapso()
  const keysN4 = filtros.filteredN4.map((n4) => n4.n4Codigo)
  const keysN7 = filtros.filteredN7.map((r) => forecastN7Key(r.n4Codigo, r.n7.n7Codigo))
  const colapso = tab === 'n4' ? colapsoN4 : colapsoN7
  const keys = tab === 'n4' ? keysN4 : keysN7

  return { colapsoN4, colapsoN7, keysN4, keysN7, colapso, keys }
}
