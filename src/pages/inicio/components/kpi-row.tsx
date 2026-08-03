import { Icon, KpiCard } from '@/shared/ui'

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
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#E1FBEF] px-1.5 py-0.5 text-[11.5px] font-bold text-[#067647]">
              <Icon name="trendup" size={10} color="#067647" /> 8.0%
            </span>
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
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#E1FBEF] px-1.5 py-0.5 text-[11.5px] font-bold text-[#067647]">
              <Icon name="trendup" size={10} color="#067647" /> 2.1%
            </span>
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
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#E1FBEF] px-1.5 py-0.5 text-[11.5px] font-bold text-[#067647]">
              <Icon name="trendup" size={10} color="#067647" /> 3.4%
            </span>
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
            <span className="rounded-[4px] bg-[#FFF4E0] px-1.5 py-0.5 text-[11.5px] font-bold text-[#B45309]">UMBRAL 5%</span>
            <span className="text-cs-gris-oscuro">por debajo del límite</span>
          </>
        }
      />
    </div>
  )
}
