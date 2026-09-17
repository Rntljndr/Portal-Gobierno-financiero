import { useMemo } from 'react'
import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { Icon, KpiCard } from '@/shared/ui'
import { formatNumber, formatPercentCL } from '@/shared/lib/format'
import { totalsFor } from '../lib/vista-amounts'

interface ConsolidadaKpiStripProps {
  servicios: Servicio[]
  vista: CurrencyView
}

/** Mismos 4 KPI y mismos nombres que el tablero real: Nuevo Plan 2027, Forecast Base, Forecast Base + IPC,
 * Var. Plan vs Forecast + IPC — siempre visibles arriba, el ancla que no se pierde al bajar de nivel. */
export function ConsolidadaKpiStrip({ servicios, vista }: ConsolidadaKpiStripProps) {
  const totals = useMemo(() => totalsFor(servicios, vista), [servicios, vista])

  const varMonto = totals.plan - totals.fIPC
  const varPct = totals.fIPC ? (varMonto / totals.fIPC) * 100 : 0
  const unit = vista === 'dolar' ? 'US$' : 'ML'

  return (
    <div className="mx-8 mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
      <KpiCard label={`Nuevo Plan 2027 (${unit})`} value={formatNumber(totals.plan)} icon={<Icon name="dashboard" size={16} color="#0047B0" />} iconBg="#EEF1FB" />
      <KpiCard label={`Forecast Base (${unit})`} value={formatNumber(totals.fBase)} icon={<Icon name="chart" size={16} color="#0047B0" />} iconBg="#EEF1FB" />
      <KpiCard label={`Forecast Base + IPC (${unit})`} value={formatNumber(totals.fIPC)} icon={<Icon name="trendup" size={16} color="#067647" />} iconBg="#E1FBEF" />
      <KpiCard
        label="Var. Plan vs Forecast + IPC"
        value={formatPercentCL(varPct)}
        valueSize="md"
        icon={<Icon name="trendup" size={16} color={varMonto > 0 ? '#B42318' : '#067647'} />}
        iconBg={varMonto > 0 ? '#FEE8E8' : '#E1FBEF'}
      />
    </div>
  )
}
