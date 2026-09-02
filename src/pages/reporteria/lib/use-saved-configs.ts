import { useState } from 'react'
import type { CurrencyView } from '@/data/reporteria'
import { loadConfigs, persistConfigs, type SavedConfigData } from './saved-configs'
import type { useReporteriaFilters } from './use-reporteria-filters'
import type { SelMonths } from './periodo'

interface UseSavedConfigsArgs {
  filters: ReturnType<typeof useReporteriaFilters>
  vistaMoneda: CurrencyView
  setVistaMoneda: (v: CurrencyView) => void
  activeTab: string
  setActiveTab: (v: string) => void
  paisOrigenSel: string[]
  setPaisOrigenSel: (v: string[]) => void
  paisDestinoSel: string[]
  setPaisDestinoSel: (v: string[]) => void
  forecastVersion: string
  setForecastVersion: (v: string) => void
  selMonths: SelMonths
  setSelMonths: (v: SelMonths) => void
}

export function useSavedConfigs(args: UseSavedConfigsArgs) {
  const [savedConfigs, setSavedConfigs] = useState(loadConfigs)

  const buildCurrentData = (): SavedConfigData => ({
    filters: args.filters.applied,
    selMonths: args.selMonths,
    vistaMoneda: args.vistaMoneda,
    activeTab: args.activeTab,
    forecastVersion: args.forecastVersion,
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
    args.setForecastVersion(data.forecastVersion)
    args.setSelMonths(data.selMonths)
  }

  return { savedConfigs, onSave, onDelete, onLoad }
}
