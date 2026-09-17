import { useMemo } from 'react'
import { gerenciaEquipoData, rubroCuentaData, buildConsolidadoPorPais, type MetricMode } from '@/data/reporteria'
import { AnalysisHierCard, type ScrollTarget } from '@/features/analysis-hier'
import { Top5Card } from './top5-card'
import { PlanForecastChart } from './plan-forecast-chart'

interface ConsolidadoViewProps {
  metricMode: MetricMode
  selMonths: Record<string, boolean>
  scrollTarget: ScrollTarget | null
  onItemClick: (item: ScrollTarget) => void
}

export function ConsolidadoView({ metricMode, selMonths, scrollTarget, onItemClick }: ConsolidadoViewProps) {
  const porPais = useMemo(() => buildConsolidadoPorPais(), [])

  return (
    <div className="mx-8 mb-7 flex flex-col gap-4">
      <AnalysisHierCard title="Vista País · Consolidado por División (USD)" groups={porPais} isDolar metricMode={metricMode} highlightTarget={scrollTarget} />
      <AnalysisHierCard title="Rubro / Cuenta Contable · Consolidado (USD)" groups={rubroCuentaData} isDolar metricMode={metricMode} highlightTarget={scrollTarget} />
      <AnalysisHierCard title="Gerencia / Equipo · Consolidado (USD)" groups={gerenciaEquipoData} isDolar metricMode={metricMode} highlightTarget={scrollTarget} />
      <div className="grid grid-cols-2 items-stretch gap-4">
        <PlanForecastChart title="Plan vs Forecast · Consolidado USD" selMonths={selMonths} isDolar />
        <Top5Card groups={gerenciaEquipoData} isDolar onItemClick={onItemClick} />
      </div>
    </div>
  )
}
