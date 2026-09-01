import { Icon, KpiCard } from '@/shared/ui'
import { REALES_LAST_CLOSED } from '@/data/reales'
import { fmtReales, type RealesTotals } from '../lib/reales-calc'

interface RealesKpisProps {
  totals: RealesTotals
  currency: string
}

export function RealesKpis({ totals, currency }: RealesKpisProps) {
  const planAcum = (totals.plan * REALES_LAST_CLOSED) / 12
  const desvioAcum = totals.real - planAcum
  const pctDesvioAcum = planAcum > 0 ? (desvioAcum / planAcum) * 100 : null
  const pctEjecutado = totals.plan > 0 ? ((totals.real / totals.plan) * 100).toFixed(0) : null
  const over = desvioAcum > 0

  return (
    <div className="mx-8 mb-5.5 grid grid-cols-4 gap-3.5">
      <KpiCard label="Plan acum. Ene-Jul" value={fmtReales(planAcum, currency)} icon={<Icon name="dollar" size={16} color="#0047B0" />} iconBg="#EEF4FF" delta="Prorrateo lineal del plan" />
      <KpiCard
        label="Real acum. Ene-Jul"
        value={fmtReales(totals.real, currency)}
        icon={<Icon name="check" size={16} color="#067647" />}
        iconBg="#ECFDF3"
        delta={pctEjecutado ? `${pctEjecutado}% del plan ejecutado` : '—'}
      />
      <KpiCard
        label="Desvío acum."
        value={`${over ? '+' : ''}${fmtReales(desvioAcum, currency)}`}
        icon={<Icon name="alert" size={16} color={over ? '#B42318' : '#067647'} />}
        iconBg={over ? '#FEF2F2' : '#ECFDF3'}
        delta="Real acum. − Plan acum."
      />
      <KpiCard
        label="% Desvío acum."
        value={pctDesvioAcum === null ? '—' : `${pctDesvioAcum >= 0 ? '+' : ''}${pctDesvioAcum.toFixed(1)}%`}
        icon={<Icon name="trendup" size={16} color={over ? '#B42318' : '#067647'} />}
        iconBg={over ? '#FEF2F2' : '#ECFDF3'}
        delta="Real acum. vs plan acum."
      />
    </div>
  )
}
