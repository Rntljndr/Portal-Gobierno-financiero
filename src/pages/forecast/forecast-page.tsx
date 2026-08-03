import { Breadcrumb, PageHeader } from '@/shared/ui'
import { forecastMonths } from '@/data/forecast'
import { ForecastKpis } from './components/forecast-kpis'
import { ForecastChart } from './components/forecast-chart'

export function ForecastPage() {
  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: 'SIP', to: '/' },
          { label: 'Presupuesto', to: '/ejercicios' },
          { label: 'Ejercicios', to: '/ejercicios' },
          { label: 'Forecast' },
        ]}
      />
      <PageHeader title="Forecast financiero" subtitle="Proyecciones y estimaciones de ejecución presupuestaria" />
      <ForecastKpis />

      <div className="mx-8 mb-6 rounded-[14px] border border-border bg-white p-[18px_20px_14px]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[15px] font-bold text-cs-azul-oscuro">Proyección de ejecución 2026</div>
          <div className="flex gap-3.5 text-xs text-cs-gris-oscuro">
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-full bg-cs-azul" /> Real
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-full bg-[#6922E7]" /> Forecast
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-full bg-[#22976B]" /> Optimista
            </span>
          </div>
        </div>
        <ForecastChart data={forecastMonths} />
      </div>
    </div>
  )
}
