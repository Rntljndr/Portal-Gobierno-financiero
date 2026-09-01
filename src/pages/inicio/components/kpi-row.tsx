import { Badge, Icon, KpiCard } from '@/shared/ui'

export function DashboardKpiRow() {
  return (
    <div className="mx-8 mb-5.5 grid grid-cols-4 gap-4">
      <KpiCard
        label="PLAN ASIGNADO"
        value="CLP 142.3M"
        icon={<Icon name="dollar" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
        delta={
          <>
            <Badge variant="success" shape="chip" className="text-[11.5px]">
              <Icon name="trendup" size={10} color="currentColor" /> 8.0%
            </Badge>
            <span className="text-cs-gris-oscuro">vs año anterior</span>
          </>
        }
      />
      <KpiCard
        label="FORECAST + IPC"
        value="CLP 130.5M"
        icon={<Icon name="trendup" size={16} color="#067647" />}
        iconBg="#E1FBEF"
        delta={
          <>
            <Badge variant="success" shape="chip" className="text-[11.5px]">
              <Icon name="trendup" size={10} color="currentColor" /> 2.1%
            </Badge>
            <span className="text-cs-gris-oscuro">sobre forecast base</span>
          </>
        }
      />
      <KpiCard
        label="EJECUTADO YTD"
        value="CLP 38.2M"
        icon={<Icon name="chart" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
        delta={
          <>
            <Badge variant="success" shape="chip" className="text-[11.5px]">
              <Icon name="trendup" size={10} color="currentColor" /> 3.4%
            </Badge>
            <span className="text-cs-gris-oscuro">avance del año</span>
          </>
        }
      />
      <KpiCard
        label="DESVÍO FORECAST"
        value="4.2%"
        valueSize="md"
        icon={<Icon name="alert" size={16} color="#B45309" />}
        iconBg="#FFF4E0"
        delta={
          <>
            <Badge variant="warning" shape="chip" className="text-[11.5px]">UMBRAL 5%</Badge>
            <span className="text-cs-gris-oscuro">por debajo del límite</span>
          </>
        }
      />
    </div>
  )
}
