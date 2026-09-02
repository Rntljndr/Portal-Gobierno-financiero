import { MultiSelect, Select } from '@/shared/ui'
import { countryTabs } from '@/data/reporteria'
import { forecastVersions } from '../lib/filter-catalog'
import { PeriodoSelector } from './periodo-selector'
import type { SelMonths } from '../lib/periodo'

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-[#0073FF] uppercase'

interface FeaturedFiltersProps {
  paisOrigen: string[]
  onPaisOrigenChange: (v: string[]) => void
  paisDestino: string[]
  onPaisDestinoChange: (v: string[]) => void
  forecastVersion: string
  onForecastVersionChange: (v: string) => void
  selMonths: SelMonths
  onSelMonthsChange: (v: SelMonths) => void
}

export function FeaturedFilters({
  paisOrigen, onPaisOrigenChange, paisDestino, onPaisDestinoChange,
  forecastVersion, onForecastVersionChange, selMonths, onSelMonthsChange,
}: FeaturedFiltersProps) {
  return (
    <div className="mx-8 mb-4 flex flex-wrap items-end gap-5">
      <div className="min-w-[220px]">
        <label className={label}>País origen</label>
        <MultiSelect placeholder="Todos" options={countryTabs} values={paisOrigen} onChange={onPaisOrigenChange} />
      </div>
      <div className="min-w-[220px]">
        <label className={label}>País destino</label>
        <MultiSelect placeholder="Todos" options={countryTabs} values={paisDestino} onChange={onPaisDestinoChange} />
      </div>
      <div className="min-w-[220px]">
        <label className={label}>Forecast</label>
        <Select value={forecastVersion} onChange={onForecastVersionChange} options={forecastVersions} />
      </div>
      <div>
        <label className={label}>Período</label>
        <PeriodoSelector value={selMonths} onChange={onSelMonthsChange} />
      </div>
    </div>
  )
}
