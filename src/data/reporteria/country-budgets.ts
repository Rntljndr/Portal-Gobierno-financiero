import type { CurrencyView, CountryBudget } from './types'

export const currencyViews: { id: CurrencyView; label: string }[] = [
  { id: 'origen', label: 'Origen ML' },
  { id: 'destino', label: 'Destino ML' },
  { id: 'dolar', label: 'Destino USD' },
]

export const countryTabs = ['Chile', 'Argentina', 'Brasil', 'Colombia', 'Perú', 'Uruguay', 'Estados Unidos']

export const countryFlags: Record<string, string> = {
  Argentina: '🇦🇷', Brasil: '🇧🇷', Chile: '🇨🇱', Colombia: '🇨🇴',
  Perú: '🇵🇪', Uruguay: '🇺🇾', 'Estados Unidos': '🇺🇸',
}

export const countryBudgets: CountryBudget[] = [
  { pais: 'Chile', plan: 51000, fBase: 52400, fIPC: 54077, hcPlan: 852, hcForecast: 852 },
  { pais: 'Argentina', plan: 30200, fBase: 29800, fIPC: 34073, hcPlan: 408, hcForecast: 408 },
  { pais: 'Brasil', plan: 21300, fBase: 21700, fIPC: 22676, hcPlan: 291, hcForecast: 291 },
  { pais: 'Colombia', plan: 13500, fBase: 13900, fIPC: 14623, hcPlan: 183, hcForecast: 183 },
  { pais: 'Perú', plan: 8200, fBase: 8100, fIPC: 8367, hcPlan: 102, hcForecast: 102 },
  { pais: 'Uruguay', plan: 0, fBase: 0, fIPC: 0, hcPlan: 0, hcForecast: 0, empty: true },
]
