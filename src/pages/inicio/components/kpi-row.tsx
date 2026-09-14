import { Badge, Icon, KpiCard } from '@/shared/ui'
import { formatCompact } from '@/shared/lib/format'
import { computeReportingKpis } from '../lib/dashboard-metrics'

function DeltaBadge({ pct, positiveIsGood = true }: { pct: number; positiveIsGood?: boolean }) {
  const good = positiveIsGood ? pct >= 0 : pct <= 0
  return (
    <Badge variant={good ? 'success' : 'warning'} shape="chip" className="text-[11.5px]">
      <span className={pct < 0 ? 'inline-flex rotate-180' : 'inline-flex'}>
        <Icon name="trendup" size={10} color="currentColor" />
      </span>{' '}
      {Math.abs(pct).toFixed(1)}%
    </Badge>
  )
}

export function DashboardKpiRow() {
  const kpi = computeReportingKpis()
  const umbralOk = Math.abs(kpi.desvioForecastPct) < 5

  return (
    <div className="mx-8 mb-5.5 grid grid-cols-4 gap-4">
      <KpiCard
        label="PLAN ASIGNADO"
        value={`CLP ${formatCompact(kpi.planAnualK * 1000)}`}
        icon={<Icon name="dollar" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
        delta={
          <>
            <Badge variant="primary" shape="chip" className="text-[11.5px]">{kpi.n4Count} líneas N4</Badge>
            <span className="text-cs-gris-oscuro">Reportería · anual</span>
          </>
        }
      />
      <KpiCard
        label="FORECAST + IPC"
        value={`CLP ${formatCompact(kpi.forecastIPCAnualK * 1000)}`}
        icon={<Icon name="trendup" size={16} color="#067647" />}
        iconBg="#E1FBEF"
        delta={
          <>
            <DeltaBadge pct={kpi.desvioForecastPct} positiveIsGood={false} />
            <span className="text-cs-gris-oscuro">sobre plan anual</span>
          </>
        }
      />
      <KpiCard
        label="EJECUTADO YTD"
        value={`CLP ${formatCompact(kpi.realYTDK * 1000)}`}
        icon={<Icon name="chart" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
        delta={
          <>
            <DeltaBadge pct={kpi.avancePct - 100} />
            <span className="text-cs-gris-oscuro">avance vs. plan a la fecha</span>
          </>
        }
      />
      <KpiCard
        label="DESVÍO FORECAST"
        value={`${kpi.desvioForecastPct.toFixed(1)}%`}
        valueSize="md"
        icon={<Icon name="alert" size={16} color="#B45309" />}
        iconBg="#FFF4E0"
        delta={
          <>
            <Badge variant={umbralOk ? 'success' : 'warning'} shape="chip" className="text-[11.5px]">UMBRAL 5%</Badge>
            <span className="text-cs-gris-oscuro">{umbralOk ? 'por debajo del límite' : 'sobre el límite'}</span>
          </>
        }
      />
    </div>
  )
}
