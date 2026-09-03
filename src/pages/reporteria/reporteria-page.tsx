import { Button, ColumnsDrawer, Icon } from '@/shared/ui'
import { ReporteriaHeader } from './components/page-header'
import { FiltersPanel } from './components/filters-panel'
import { CountrySummaryPanel } from './components/country-summary-panel'
import { CountryTabs } from './components/country-tabs'
import { CountryAnalysis } from './components/country-analysis'
import { ConsolidadoView } from './components/consolidado-view'
import { TotalsKpiBar } from './components/totals-kpi-bar'
import { PepN4Table } from './components/pep-n4-table/pep-n4-table'
import { DescargarModal } from './components/descargar-modal'
import { ALL_STICKY_COLS } from './lib/pep-n4-table-cols'
import { useReporteriaPageState } from './lib/use-reporteria-page-state'

const TOGGLEABLE_STICKY_COLS = ALL_STICKY_COLS.filter((c) => c.toggleable)

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
        <Button variant="outline" size="sm" onClick={() => s.setShowDescargar(true)}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar
        </Button>
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
      <ColumnsDrawer open={s.showColumnas} cols={TOGGLEABLE_STICKY_COLS} visibleCols={s.visibleCols} onApply={s.setVisibleCols} onClose={() => s.setShowColumnas(false)} />
    </div>
  )
}
