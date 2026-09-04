import { Icon, KpiCard } from '@/shared/ui'
import { prelimFmt } from '../lib/preliminares-calc'

interface PreliminaresKpisProps {
  planMes: number
  acumReal: number
  forecastMes: number
  desvioAcumMonto: number
  desvioAcumPct: number | null
}

export function PreliminaresKpis({ planMes, acumReal, forecastMes, desvioAcumMonto, desvioAcumPct }: PreliminaresKpisProps) {
  const over = desvioAcumMonto > 0

  return (
    <div className="mx-8 mb-4 grid grid-cols-4 gap-3.5">
      <KpiCard label="Plan del mes" value={prelimFmt(planMes, 'USD')} icon={<Icon name="dollar" size={16} color="#0047B0" />} iconBg="#EEF4FF" delta="Monto presupuestado del mes" />
      <KpiCard label="Real acumulado" value={prelimFmt(acumReal, 'USD')} icon={<Icon name="check" size={16} color="#067647" />} iconBg="#ECFDF3" delta="Enero a último mes cerrado" />
      <KpiCard label="Forecast del mes" value={prelimFmt(forecastMes, 'USD')} icon={<Icon name="trendup" size={16} color="#6922E7" />} iconBg="#F8F5FF" delta="Último forecast vigente" />
      <KpiCard
        label="Desvío acumulado"
        value={`${over ? '+' : ''}${prelimFmt(desvioAcumMonto, 'USD')}`}
        icon={<Icon name="alert" size={16} color={over ? '#B42318' : '#067647'} />}
        iconBg={over ? '#FEF2F2' : '#ECFDF3'}
        delta={desvioAcumPct === null ? 'Real acum. − Plan acum.' : `${desvioAcumPct >= 0 ? '+' : ''}${desvioAcumPct.toFixed(1)}% vs plan acum.`}
      />
    </div>
  )
}
