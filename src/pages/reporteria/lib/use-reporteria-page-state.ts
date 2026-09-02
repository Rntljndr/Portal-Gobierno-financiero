import { useEffect, useState } from 'react'
import type { CurrencyView, MetricMode } from '@/data/reporteria'
import { TOGGLEABLE_COL_KEYS } from './pep-n4-table-cols'
import { useReporteriaFilters } from './use-reporteria-filters'
import { useSavedConfigs } from './use-saved-configs'
import type { ScrollTarget } from './scroll-target'

export function useReporteriaPageState() {
  const [vistaMoneda, setVistaMoneda] = useState<CurrencyView>('origen')
  const [metricMode, setMetricMode] = useState<MetricMode>('ipc')
  const [activeTab, setActiveTab] = useState('Chile')
  const [showDescargar, setShowDescargar] = useState(false)
  const [visibleCols, setVisibleCols] = useState<string[]>(TOGGLEABLE_COL_KEYS)
  const [showColumnas, setShowColumnas] = useState(false)
  const [scrollTarget, setScrollTarget] = useState<ScrollTarget | null>(null)
  const filtersState = useReporteriaFilters()
  const savedConfigsState = useSavedConfigs({
    filters: filtersState,
    vistaMoneda,
    setVistaMoneda,
    activeTab,
    setActiveTab,
  })

  useEffect(() => {
    if (vistaMoneda === 'dolar') setActiveTab('Consolidado')
    else setActiveTab((prev) => (prev === 'Consolidado' ? 'Chile' : prev))
    if (vistaMoneda === 'origen') setMetricMode('ipc')
  }, [vistaMoneda])

  return {
    vistaMoneda, setVistaMoneda,
    metricMode, setMetricMode,
    activeTab, setActiveTab,
    showDescargar, setShowDescargar,
    visibleCols, setVisibleCols,
    showColumnas, setShowColumnas,
    scrollTarget, setScrollTarget,
    filtersState,
    savedConfigsState,
  }
}
