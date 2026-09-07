import { useState, type ReactNode } from 'react'
import { useForecastStore } from '@/pages/forecast/lib/use-forecast-store'
import { activeComparisonKeys, EMPTY_COMPARISONS, type Comparisons } from './comparisons'
import { defaultForecastRoundId, forecastRoundLabel } from './forecast-comparison'
import { RealesComparisonsContext, type RealesComparisonsStore } from './reales-comparisons-context'

export function RealesComparisonsProvider({ children }: { children: ReactNode }) {
  const { rounds } = useForecastStore()
  // Ajuste R2: la tabla entra sin ninguna comparativa activa — el usuario las agrega desde el drawer.
  const [comparisons, setComparisons] = useState<Comparisons>(EMPTY_COMPARISONS)
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set())

  const comparisonKeys = activeComparisonKeys(comparisons)
  const forecastRound = comparisons.forecastRoundId ? (rounds.find((r) => r.id === comparisons.forecastRoundId) ?? null) : null
  const activeRound = forecastRound ?? rounds.find((r) => r.id === defaultForecastRoundId(rounds)) ?? null
  const activeForecastLabel = activeRound ? forecastRoundLabel(rounds, activeRound) : null

  const toggleRowCollapse = (codigo: string) =>
    setCollapsedRows((prev) => {
      const next = new Set(prev)
      if (next.has(codigo)) next.delete(codigo)
      else next.add(codigo)
      return next
    })
  const allRowsCollapsed = (codigos: string[]) => codigos.length > 0 && codigos.every((c) => collapsedRows.has(c))
  const toggleAllRows = (codigos: string[]) => setCollapsedRows(allRowsCollapsed(codigos) ? new Set() : new Set(codigos))

  const store: RealesComparisonsStore = {
    comparisons,
    setComparisons,
    comparisonKeys,
    forecastRound,
    collapsedRows,
    toggleRowCollapse,
    allRowsCollapsed,
    toggleAllRows,
    activeForecastLabel,
  }

  return <RealesComparisonsContext.Provider value={store}>{children}</RealesComparisonsContext.Provider>
}
