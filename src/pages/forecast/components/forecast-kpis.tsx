import { Icon, KpiCard } from '@/shared/ui'

export function ForecastKpis() {
  return (
    <div className="mx-8 mb-[22px] grid grid-cols-3 gap-4">
      <KpiCard
        label="FORECAST TOTAL 2026"
        value="$11.2M"
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
        label="TENDENCIA"
        value="Positiva"
        valueSize="md"
        icon={<Icon name="trendup" size={16} color="#6922E7" />}
        iconBg="#F1ECFE"
        delta={<span className="text-cs-gris-oscuro">Crecimiento estable</span>}
      />
      <KpiCard
        label="PRÓXIMA REVISIÓN"
        value="15 May"
        valueSize="md"
        icon={<Icon name="calendar" size={16} color="#B45309" />}
        iconBg="#FFF4E0"
        delta={<span className="text-cs-gris-oscuro">Comité financiero</span>}
      />
    </div>
  )
}
