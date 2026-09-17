import { useMemo } from 'react'
import { paisMoneda as paisMonedaMap, type Pais, type Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { Icon, KpiCard } from '@/shared/ui'
import { formatNumber, formatPercentCL } from '@/shared/lib/format'
import { fragmentsFor, totalsFor } from '../lib/vista-amounts'

interface ConsolidadoKpiStripProps {
  servicios: Servicio[]
  vista: CurrencyView
  paisMoneda: Pais | null
}

export function ConsolidadoKpiStrip({ servicios, vista, paisMoneda }: ConsolidadoKpiStripProps) {
  const totals = useMemo(() => totalsFor(servicios, vista, paisMoneda), [servicios, vista, paisMoneda])
  const { count, paisesDestino } = useMemo(() => {
    let n = 0
    const destinos = new Set<string>()
    for (const s of servicios) {
      const frags = fragmentsFor(s, vista, paisMoneda)
      if (frags.length > 0) n += 1
      frags.forEach((f) => destinos.add(f.pais))
    }
    return { count: n, paisesDestino: destinos.size }
  }, [servicios, vista, paisMoneda])
  const varMonto = totals.plan - totals.fIPC
  const varPct = totals.fIPC ? (varMonto / totals.fIPC) * 100 : 0
  const unit = vista === 'dolar' ? 'USD' : paisMoneda ? paisMonedaMap[paisMoneda] : 'ML'

  return (
    <div className="mx-8">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
          {paisMoneda || vista === 'dolar' ? 'Resumen consolidado' : 'Resumen según filtros'}
        </div>
        <div className="text-[11.5px] text-muted-foreground">{count} PEP N4 · {paisesDestino} países destino</div>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label={`Nuevo Plan 2027 · ${unit}`}
          value={formatNumber(totals.plan)}
          icon={<Icon name="dashboard" size={16} color="#0047B0" />}
          iconBg="#EEF1FB"
          delta={<span className="text-cs-gris-oscuro">Propuesta de presupuesto anual</span>}
        />
        <KpiCard
          label={`Forecast Base · ${unit}`}
          value={formatNumber(totals.fBase)}
          icon={<Icon name="chart" size={16} color="#0047B0" />}
          iconBg="#EEF1FB"
          delta={<span className="text-cs-gris-oscuro">Sin ajuste · dato informativo</span>}
        />
        <KpiCard
          label={`Forecast Base + IPC · ${unit}`}
          value={formatNumber(totals.fIPC)}
          icon={<Icon name="trendup" size={16} color="#067647" />}
          iconBg="#E1FBEF"
          delta={<span className="text-cs-gris-oscuro">Base oficial de comparación</span>}
        />
        <KpiCard
          label="Var. Plan vs. Base + IPC"
          value={formatNumber(varMonto)}
          valueSize="md"
          icon={<Icon name="trendup" size={16} color={varMonto > 0 ? '#B42318' : '#067647'} />}
          iconBg={varMonto > 0 ? '#FEE8E8' : '#E1FBEF'}
          delta={<span className="text-cs-gris-oscuro">{formatPercentCL(varPct)} respecto de forecast + IPC</span>}
        />
      </div>
    </div>
  )
}
