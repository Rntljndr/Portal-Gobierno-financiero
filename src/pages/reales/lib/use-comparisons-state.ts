import { useState } from 'react'
import { useForecastStore } from '@/pages/forecast/lib/use-forecast-store'
import { activeComparisonKeys, DEFAULT_COMPARISONS, type Comparisons } from './comparisons'

/** Estado de comparaciones compartido por las 3 pantallas de Reales: qué comparar, con qué forecast, y qué PEPs tienen su comparativa colapsada. */
export function useComparisonsState() {
  const { rounds } = useForecastStore()
  // Presupuesto viene activo por defecto (Ajuste R2); Forecast y Año anterior son opcionales, se agregan desde el drawer.
  const [comparisons, setComparisons] = useState<Comparisons>(DEFAULT_COMPARISONS)
  // Set de códigos de PEP cuya comparativa (todas sus filas activas) está colapsada. Vacío = todo expandido por defecto.
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set())

  const comparisonKeys = activeComparisonKeys(comparisons)
  const forecastRound = comparisons.forecastRoundId ? (rounds.find((r) => r.id === comparisons.forecastRoundId) ?? null) : null

  const toggleRowCollapse = (codigo: string) =>
    setCollapsedRows((prev) => {
      const next = new Set(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.add(codigo)
      return next
    })
  const allRowsCollapsed = (codigos: string[]) => codigos.length > 0 && codigos.every((c) => collapsedRows.has(c))
  const toggleAllRows = (codigos: string[]) => setCollapsedRows(allRowsCollapsed(codigos) ? new Set() : new Set(codigos))

  return {
    comparisons,
    setComparisons,
    comparisonKeys,
    forecastRound,
    collapsedRows,
    toggleRowCollapse,
    allRowsCollapsed,
    toggleAllRows,
  }
}
