import { Icon, KpiCard } from '@/shared/ui'
import { prelimFmt } from '../lib/preliminares-calc'

interface PreliminaresKpisProps {
  realMes: number
  planMes: number
  forecastMes: number
  desvioMes: number
  desvioMesPct: number | null
}

/** Ajuste P1: solo datos del mes — Real, Plan, Forecast, Desvío (Preliminar del mes − Plan del mes), en ese orden. */
export function PreliminaresKpis({ realMes, planMes, forecastMes, desvioMes, desvioMesPct }: PreliminaresKpisProps) {
  const over = desvioMes > 0

  return (
    <div className="mx-8 mb-4 grid grid-cols-4 gap-3.5">
      <KpiCard label="Real del mes" value={prelimFmt(realMes, 'USD')} icon={<Icon name="check" size={16} color="#067647" />} iconBg="#ECFDF3" delta="Enero a último mes cerrado" />
      <KpiCard label="Plan del mes" value={prelimFmt(planMes, 'USD')} icon={<Icon name="dollar" size={16} color="#0047B0" />} iconBg="#EEF4FF" delta="Monto presupuestado del mes" />
      <KpiCard label="Forecast del mes" value={prelimFmt(forecastMes, 'USD')} icon={<Icon name="trendup" size={16} color="#6922E7" />} iconBg="#F8F5FF" delta="Último forecast vigente" />
      <KpiCard
        label="Desvío del mes"
        value={`${over ? '+' : ''}${prelimFmt(desvioMes, 'USD')}`}
        icon={<Icon name="alert" size={16} color={over ? '#B42318' : '#067647'} />}
        iconBg={over ? '#FEF2F2' : '#ECFDF3'}
        delta={desvioMesPct === null ? 'Preliminar − Plan del mes' : `${desvioMesPct >= 0 ? '+' : ''}${desvioMesPct.toFixed(1)}% vs plan del mes`}
      />
    </div>
  )
}
