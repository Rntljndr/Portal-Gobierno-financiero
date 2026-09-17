import { useMemo, useState } from 'react'
import { Breadcrumb, PageHeader } from '@/shared/ui'
import { servicios } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { ConsolidadaCurrencyToggle } from './components/consolidada-currency-toggle'
import { ConsolidadaMacroChips } from './components/consolidada-macro-chips'
import { ConsolidadaFiltersPanel } from './components/consolidada-filters-panel'
import { ConsolidadaKpiStrip } from './components/consolidada-kpi-strip'
import { CategorySummaryCards } from './components/category-summary-cards'
import { GerenciaDonutChart } from './components/gerencia-donut-chart'
import { OrigenServicioBars } from './components/origen-servicio-bars'
import { EvolucionMensualChart } from './components/evolucion-mensual-chart'
import { DimensionAnalysisCard } from './components/dimension-analysis-card'
import { useConsolidadaFilters } from './lib/use-consolidada-filters'
import { filterServicios } from './lib/filter-servicios'
import { totalsFor } from './lib/vista-amounts'

export function ReporteriaConsolidadaPage() {
  const [vista, setVista] = useState<CurrencyView>('dolar')
  const { filters, onChange, onClear, activeCount } = useConsolidadaFilters()

  const filtrados = useMemo(() => filterServicios(servicios, filters), [filters])
  const totals = useMemo(() => totalsFor(filtrados, vista), [filtrados, vista])

  return (
    <div className="h-full overflow-y-auto">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Reportería', to: '/reporteria' },
          { label: 'Reportería Consolidada' },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-3 p-[10px_32px_20px]">
        <PageHeader title="Reportería Consolidada" subtitle="Plan OPEX — total, país, rubro y tipo de gasto en una sola vista, sin pestañas por país" />
        <div className="rounded-xl bg-primary p-[10px_14px]">
          <ConsolidadaCurrencyToggle value={vista} onChange={setVista} />
        </div>
      </div>

      <ConsolidadaMacroChips />
      <ConsolidadaFiltersPanel filters={filters} onChange={onChange} onClear={onClear} activeCount={activeCount} />
      <ConsolidadaKpiStrip servicios={filtrados} vista={vista} />

      <div className="mx-8 mb-7 flex flex-col gap-6">
        <CategorySummaryCards
          title="Resumen por Rubro"
          subtitle="Monto del Plan por Rubro según filtros aplicados"
          servicios={filtrados}
          vista={vista}
          dim="rubro"
        />
        <CategorySummaryCards
          title="Resumen por Origen del Servicio"
          subtitle="Una tarjeta por categoría (Recurrente, Nuevo Servicio, Post Implementación, Sin origen informado)"
          servicios={filtrados}
          vista={vista}
          dim="origenServicio"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GerenciaDonutChart servicios={filtrados} vista={vista} />
          <OrigenServicioBars servicios={filtrados} vista={vista} />
        </div>

        <EvolucionMensualChart totalPlan={totals.plan} totalFIPC={totals.fIPC} isDolar={vista === 'dolar'} />

        <DimensionAnalysisCard servicios={filtrados} vista={vista} />
      </div>
    </div>
  )
}
