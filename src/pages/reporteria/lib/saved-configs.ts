import type { CurrencyView } from '@/data/reporteria'
import type { ReporteriaFilters } from './use-reporteria-filters'
import type { SelMonths } from './periodo'

const STORAGE_KEY = 'rr_reporteria_configs_v1'

export interface SavedConfigData {
  filters: ReporteriaFilters
  selMonths: SelMonths
  vistaMoneda: CurrencyView
  activeTab: string
  forecastVersion: string
}

export interface SavedConfig {
  name: string
  ts: string
  data: SavedConfigData
}

export function loadConfigs(): SavedConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedConfig[]) : []
  } catch {
    return []
  }
}

export function persistConfigs(configs: SavedConfig[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
  } catch {
    // localStorage no disponible (modo privado, etc.) — la config simplemente no persiste
  }
}
