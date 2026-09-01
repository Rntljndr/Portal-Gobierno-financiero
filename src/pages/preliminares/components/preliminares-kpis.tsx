import { Icon, KpiCard } from '@/shared/ui'
import { prelimFmt } from '../lib/preliminares-calc'

const REALES_LAST_CLOSED = 7

interface PreliminaresKpisProps {
  planBase: number
  acumReal: number
  disponible: number
}

export function PreliminaresKpis({ planBase, acumReal, disponible }: PreliminaresKpisProps) {
  const planAcum = (planBase * REALES_LAST_CLOSED) / 12
  const desvioAcum = acumReal - planAcum
  const pctDesvioAcum = planAcum > 0 ? (desvioAcum / planAcum) * 100 : null
  const pctEjecutado = planBase > 0 ? ((acumReal / planBase) * 100).toFixed(0) : null
  const over = desvioAcum > 0

  return (
    <div className="mx-8 mb-4 grid grid-cols-4 gap-3.5">
      <KpiCard label="Plan acum. Ene-Jul" value={prelimFmt(planAcum, 'USD')} icon={<Icon name="dollar" size={16} color="#0047B0" />} iconBg="#EEF4FF" delta="Prorrateo lineal del plan" />
      <KpiCard
        label="Real acum. Ene-Jul"
        value={prelimFmt(acumReal, 'USD')}
        icon={<Icon name="check" size={16} color="#067647" />}
        iconBg="#ECFDF3"
        delta={pctEjecutado ? `${pctEjecutado}% del plan anual ejecutado` : '—'}
      />
      <KpiCard label="Disponible" value={prelimFmt(disponible, 'USD')} icon={<Icon name="dollar" size={16} color="#B45309" />} iconBg="#FFF7ED" delta="Plan − Real acumulado" />
      <KpiCard
        label="Desvío acum."
        value={pctDesvioAcum === null ? '—' : `${pctDesvioAcum >= 0 ? '+' : ''}${pctDesvioAcum.toFixed(1)}%`}
        icon={<Icon name="trendup" size={16} color={over ? '#B42318' : '#067647'} />}
        iconBg={over ? '#FEF2F2' : '#ECFDF3'}
        delta="Real acum vs plan acum"
      />
    </div>
  )
}
