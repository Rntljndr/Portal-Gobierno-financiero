import { Icon, KpiCard, type VistaNumero } from '@/shared/ui'
import { formatNumber, formatMillones, formatPercentCL, toUSD } from '@/shared/lib/format'
import type { DireccionLeaf } from '@/data/reporte-direccion'
import type { CurrencyView } from '@/data/reporteria'

interface DireccionKpiRowProps {
  totals: DireccionLeaf
  vista: CurrencyView
  vistaNumero: VistaNumero
}

export function DireccionKpiRow({ totals, vista, vistaNumero }: DireccionKpiRowProps) {
  const isDolar = vista === 'dolar'
  const unit = isDolar ? ' (US$)' : ' (ML)'
  const fmt = (v: number) => {
    const converted = isDolar ? toUSD(v) : v
    return vistaNumero === 'millones' ? formatMillones(converted) : formatNumber(converted)
  }

  const varVsPlan = totals.real - totals.plan
  const varPct = totals.plan ? (varVsPlan / totals.plan) * 100 : 0
  const varAA = totals.realAnterior ? ((totals.real - totals.realAnterior) / totals.realAnterior) * 100 : 0

  return (
    <div className="mx-8 mb-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        label={`Total Real${unit}`}
        value={fmt(totals.real)}
        icon={<Icon name="chart" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
      />
      <KpiCard
        label={`Total Plan${unit}`}
        value={fmt(totals.plan)}
        icon={<Icon name="dollar" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
      />
      <KpiCard
        label={`Var Real vs Plan${unit}`}
        value={fmt(varVsPlan)}
        valueSize="md"
        icon={<Icon name="trendup" size={16} color={varVsPlan >= 0 ? '#067647' : '#B42318'} />}
        iconBg={varVsPlan >= 0 ? '#E1FBEF' : '#FEE8E8'}
      />
      <KpiCard
        label="Var %"
        value={formatPercentCL(varPct)}
        valueSize="md"
        icon={<Icon name="trendup" size={16} color={varPct >= 0 ? '#067647' : '#B42318'} />}
        iconBg={varPct >= 0 ? '#E1FBEF' : '#FEE8E8'}
      />
      <KpiCard
        label="Var A/A %"
        value={formatPercentCL(varAA)}
        valueSize="md"
        icon={<Icon name="trendup" size={16} color={varAA >= 0 ? '#067647' : '#B42318'} />}
        iconBg={varAA >= 0 ? '#E1FBEF' : '#FEE8E8'}
      />
      <KpiCard
        label={`Total Cencosud${unit}`}
        value={fmt(totals.real)}
        icon={<Icon name="dashboard" size={16} color="#0047B0" />}
        iconBg="#EEF1FB"
      />
    </div>
  )
}
