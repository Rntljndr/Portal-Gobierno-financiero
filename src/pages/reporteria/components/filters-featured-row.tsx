import { MultiSelect, Select } from '@/shared/ui'
import { countryTabs } from '@/data/reporteria'
import { forecastVersions } from '../lib/filter-catalog'
import { PeriodoSelector } from './periodo-selector'
import type { ReporteriaFilters } from '../lib/use-reporteria-filters'

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-[#0073FF] uppercase'

interface FiltersFeaturedRowProps {
  draft: ReporteriaFilters
  onChange: <K extends keyof ReporteriaFilters>(key: K, value: ReporteriaFilters[K]) => void
}

export function FiltersFeaturedRow({ draft, onChange }: FiltersFeaturedRowProps) {
  return (
    <div className="flex flex-wrap items-end gap-5 p-[14px_18px_8px]">
      <div className="min-w-[220px]">
        <label className={label}>País origen</label>
        <MultiSelect placeholder="Todos" options={countryTabs} values={draft.paisOrigen} onChange={(v) => onChange('paisOrigen', v)} />
      </div>
      <div className="min-w-[220px]">
        <label className={label}>País destino</label>
        <MultiSelect placeholder="Todos" options={countryTabs} values={draft.paisDestino} onChange={(v) => onChange('paisDestino', v)} />
      </div>
      <div className="min-w-[220px]">
        <label className={label}>Forecast</label>
        <Select value={draft.forecastVersion} onChange={(v) => onChange('forecastVersion', v)} options={forecastVersions} />
      </div>
      <div>
        <label className={label}>Período</label>
        <PeriodoSelector value={draft.selMonths} onChange={(v) => onChange('selMonths', v)} />
      </div>
    </div>
  )
}
