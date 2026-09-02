import { ReporteriaHeader } from './components/page-header'
import { FiltersPanel } from './components/filters-panel'
import { CountrySummaryPanel } from './components/country-summary-panel'
import { CountryTabs } from './components/country-tabs'
import { CountryAnalysis } from './components/country-analysis'
import { ConsolidadoView } from './components/consolidado-view'
import { TotalsKpiBar } from './components/totals-kpi-bar'
import { PepN4Table } from './components/pep-n4-table/pep-n4-table'
import { DescargarModal } from './components/descargar-modal'
import { ColumnsDrawer } from './components/columns-drawer'
import { useReporteriaPageState } from './lib/use-reporteria-page-state'

export function ReporteriaPage() {
  const s = useReporteriaPageState()
  const applied = s.filtersState.applied

  return (
    <div className="h-full overflow-y-auto">
      <ReporteriaHeader forecastVersion={s.filtersState.draft.forecastVersion} savedConfigsState={s.savedConfigsState} />
      <FiltersPanel
        draft={s.filtersState.draft}
        onChange={s.filtersState.onChange}
        onClear={s.filtersState.onClear}
        onApply={s.filtersState.onApply}
        pending={s.filtersState.pending}
        activeCount={s.filtersState.activeCount}
      />
      <CountrySummaryPanel
        paisSel={applied.paisOrigen}
        metricMode={s.metricMode}
        onMetricModeChange={s.setMetricMode}
        vistaMoneda={s.vistaMoneda}
        onVistaMonedaChange={s.setVistaMoneda}
      />
      {s.vistaMoneda === 'dolar' && <TotalsKpiBar />}

      <div className="mx-8 mb-1.5 flex items-center justify-between">
        <div className="text-[15px] font-bold tracking-tight text-foreground">Explorar en detalle</div>
        <button
          type="button"
          onClick={() => s.setShowDescargar(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3 py-[7px] text-xs font-semibold text-primary hover:bg-[#F4F7FE]"
        >
          Descargar
        </button>
      </div>
      <CountryTabs active={s.activeTab} onChange={s.setActiveTab} showConsolidado={s.vistaMoneda === 'dolar'} onColumnasClick={() => s.setShowColumnas(true)} />

      {s.activeTab === 'Tablón' ? (
        <div className="mx-8 mb-7">
          <PepN4Table visibleCols={s.visibleCols} />
        </div>
      ) : s.activeTab === 'Consolidado' ? (
        <ConsolidadoView metricMode={s.metricMode} selMonths={applied.selMonths} scrollTarget={s.scrollTarget} onItemClick={s.setScrollTarget} />
      ) : (
        <CountryAnalysis country={s.activeTab} metricMode={s.metricMode} selMonths={applied.selMonths} scrollTarget={s.scrollTarget} onItemClick={s.setScrollTarget} />
      )}

      <DescargarModal open={s.showDescargar} onClose={() => s.setShowDescargar(false)} />
      <ColumnsDrawer open={s.showColumnas} visibleCols={s.visibleCols} onApply={s.setVisibleCols} onClose={() => s.setShowColumnas(false)} />
    </div>
  )
}
