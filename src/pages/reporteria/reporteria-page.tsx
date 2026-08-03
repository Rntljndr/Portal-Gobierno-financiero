import { useEffect, useState } from 'react'
import type { CurrencyView } from '@/data/reporteria'
import { ReporteriaHeader } from './components/page-header'
import { CurrencyToggle } from './components/currency-toggle'
import { FiltersPanel } from './components/filters-panel'
import { CountrySummaryPanel } from './components/country-summary-panel'
import { CountryTabs } from './components/country-tabs'
import { CountryAnalysis } from './components/country-analysis'
import { ConsolidadoView } from './components/consolidado-view'
import { TotalsKpiBar } from './components/totals-kpi-bar'
import { PepN4Table } from './components/pep-n4-table/pep-n4-table'
import { useReporteriaFilters } from './lib/use-reporteria-filters'

export function ReporteriaPage() {
  const [vistaMoneda, setVistaMoneda] = useState<CurrencyView>('origen')
  const [activeTab, setActiveTab] = useState('Chile')
  const { filters, onChange, clear, activeCount } = useReporteriaFilters()

  useEffect(() => {
    if (vistaMoneda === 'dolar') setActiveTab('Consolidado')
    else setActiveTab((prev) => (prev === 'Consolidado' ? 'Chile' : prev))
  }, [vistaMoneda])

  return (
    <div className="h-full overflow-y-auto">
      <ReporteriaHeader />
      <CurrencyToggle value={vistaMoneda} onChange={setVistaMoneda} />
      <FiltersPanel filters={filters} onChange={onChange} onClear={clear} activeCount={activeCount} />
      <CountrySummaryPanel paisSel={filters.paisOrigen} />
      {vistaMoneda === 'dolar' && <TotalsKpiBar />}

      <div className="mx-8 mb-1.5 text-[15px] font-bold tracking-tight text-foreground">Explorar en detalle</div>
      <CountryTabs active={activeTab} onChange={setActiveTab} showConsolidado={vistaMoneda === 'dolar'} />

      {activeTab === 'Tablón' ? (
        <div className="mx-8 mb-7">
          <PepN4Table />
        </div>
      ) : activeTab === 'Consolidado' ? (
        <ConsolidadoView />
      ) : (
        <CountryAnalysis country={activeTab} />
      )}
    </div>
  )
}
