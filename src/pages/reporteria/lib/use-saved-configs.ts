import { useState } from 'react'
import type { CurrencyView } from '@/data/reporteria'
import { loadConfigs, persistConfigs, type SavedConfigData } from './saved-configs'
import type { useReporteriaFilters } from './use-reporteria-filters'

interface UseSavedConfigsArgs {
  filters: ReturnType<typeof useReporteriaFilters>
  vistaMoneda: CurrencyView
  setVistaMoneda: (v: CurrencyView) => void
  activeTab: string
  setActiveTab: (v: string) => void
}

export function useSavedConfigs(args: UseSavedConfigsArgs) {
  const [savedConfigs, setSavedConfigs] = useState(loadConfigs)

  const buildCurrentData = (): SavedConfigData => ({
    filters: args.filters.applied,
    vistaMoneda: args.vistaMoneda,
    activeTab: args.activeTab,
  })

  const onSave = (name: string) => {
    const item = { name, ts: new Date().toISOString(), data: buildCurrentData() }
    const next = [item, ...savedConfigs.filter((c) => c.name !== name)]
    setSavedConfigs(next)
    persistConfigs(next)
  }

  const onDelete = (name: string) => {
    const next = savedConfigs.filter((c) => c.name !== name)
    setSavedConfigs(next)
    persistConfigs(next)
  }

  const onLoad = (data: SavedConfigData) => {
    args.filters.loadFilters(data.filters)
    args.setVistaMoneda(data.vistaMoneda)
    args.setActiveTab(data.activeTab)
  }

  return { savedConfigs, onSave, onDelete, onLoad }
}
