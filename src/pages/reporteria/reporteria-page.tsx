import { useEffect, useState } from 'react'
import type { CurrencyView } from '@/data/reporteria'
import { ReporteriaHeader } from './components/page-header'
import { CurrencyToggle } from './components/currency-toggle'
import { FeaturedFilters } from './components/featured-filters'
import { FiltersPanel } from './components/filters-panel'
import { CountrySummaryPanel } from './components/country-summary-panel'
import { CountryTabs } from './components/country-tabs'
import { CountryAnalysis } from './components/country-analysis'
import { ConsolidadoView } from './components/consolidado-view'
import { TotalsKpiBar } from './components/totals-kpi-bar'
import { PepN4Table } from './components/pep-n4-table/pep-n4-table'
import { DescargarModal } from './components/descargar-modal'
import { useReporteriaFilters } from './lib/use-reporteria-filters'
import { useSavedConfigs } from './lib/use-saved-configs'
import { allMonthsSelected } from './lib/periodo'

export function ReporteriaPage() {
  const [vistaMoneda, setVistaMoneda] = useState<CurrencyView>('origen')
  const [activeTab, setActiveTab] = useState('Chile')
  const [paisOrigenSel, setPaisOrigenSel] = useState<string[]>([])
  const [paisDestinoSel, setPaisDestinoSel] = useState<string[]>([])
  const [forecastVersion, setForecastVersion] = useState('F2_2027')
  const [selMonths, setSelMonths] = useState(allMonthsSelected)
  const [showDescargar, setShowDescargar] = useState(false)
  const filtersState = useReporteriaFilters()
  const savedConfigsState = useSavedConfigs({
    filters: filtersState,
    vistaMoneda,
    setVistaMoneda,
    activeTab,
    setActiveTab,
    paisOrigenSel,
    setPaisOrigenSel,
    paisDestinoSel,
    setPaisDestinoSel,
    forecastVersion,
    setForecastVersion,
    selMonths,
    setSelMonths,
  })

  useEffect(() => {
    if (vistaMoneda === 'dolar') setActiveTab('Consolidado')
    else setActiveTab((prev) => (prev === 'Consolidado' ? 'Chile' : prev))
  }, [vistaMoneda])

  return (
    <div className="h-full overflow-y-auto">
      <ReporteriaHeader forecastVersion={forecastVersion} savedConfigsState={savedConfigsState} />
      <CurrencyToggle value={vistaMoneda} onChange={setVistaMoneda} />
      <FeaturedFilters
        paisOrigen={paisOrigenSel}
        onPaisOrigenChange={setPaisOrigenSel}
        paisDestino={paisDestinoSel}
        onPaisDestinoChange={setPaisDestinoSel}
        forecastVersion={forecastVersion}
        onForecastVersionChange={setForecastVersion}
        selMonths={selMonths}
        onSelMonthsChange={setSelMonths}
      />
      <FiltersPanel
        draft={filtersState.draft}
        onChange={filtersState.onChange}
        onClear={filtersState.onClear}
        onApply={filtersState.onApply}
        pending={filtersState.pending}
        activeCount={filtersState.activeCount}
      />
      <CountrySummaryPanel paisSel={paisOrigenSel} />
      {vistaMoneda === 'dolar' && <TotalsKpiBar />}

      <div className="mx-8 mb-1.5 flex items-center justify-between">
        <div className="text-[15px] font-bold tracking-tight text-foreground">Explorar en detalle</div>
        <button
          type="button"
          onClick={() => setShowDescargar(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-primary hover:bg-[#F4F7FE]"
        >
          Descargar
        </button>
      </div>
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

      <DescargarModal open={showDescargar} onClose={() => setShowDescargar(false)} />
    </div>
  )
}
