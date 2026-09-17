import { useMemo } from 'react'
import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { Icon, KpiCard } from '@/shared/ui'
import { formatNumber, formatPercentCL } from '@/shared/lib/format'
import { buildDimensionTree, sumDimNodes } from '../lib/build-dimension-tree'
import { computeDimMetrics } from '../lib/dimension-metrics'
import type { DimensionKey } from '../lib/dimensiones'

interface CategorySummaryCardsProps {
  title: string
  subtitle: string
  servicios: Servicio[]
  vista: CurrencyView
  dim: DimensionKey
}

/** Una tarjeta por categoría de la dimensión (Total Plan + una por cada valor), igual al patrón real
 * de "Resumen por Rubro" / "Resumen por Origen del Servicio" — variación siempre vs Forecast + IPC. */
export function CategorySummaryCards({ title, subtitle, servicios, vista, dim }: CategorySummaryCardsProps) {
  const tree = useMemo(() => buildDimensionTree(servicios, dim, vista), [servicios, dim, vista])
  const total = useMemo(() => sumDimNodes('Total Plan', tree), [tree])

  return (
    <div>
      <div className="mb-2.5">
        <div className="text-[15px] font-bold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryTile nombre="Total Plan" node={total} total={total} highlight />
        {tree.map((node) => (
          <SummaryTile key={node.nombre} nombre={node.nombre} node={node} total={total} />
        ))}
      </div>
    </div>
  )
}

function SummaryTile({ nombre, node, total, highlight }: { nombre: string; node: ReturnType<typeof sumDimNodes>; total: ReturnType<typeof sumDimNodes>; highlight?: boolean }) {
  const m = computeDimMetrics(node, total.plan)
  const varTone = m.varMonto > 0 ? '#B42318' : m.varMonto < 0 ? '#067647' : '#8A90A2'

  return (
    <KpiCard
      label={nombre.toUpperCase()}
      value={formatNumber(node.plan)}
      icon={<Icon name={highlight ? 'dashboard' : 'chart'} size={16} color={highlight ? '#0047B0' : varTone} />}
      iconBg={highlight ? '#EEF1FB' : `${varTone}1A`}
      delta={
        <>
          <span style={{ color: varTone }} className="font-semibold">
            {m.varPct > 0 ? '▲' : m.varPct < 0 ? '▼' : ''} {formatPercentCL(Math.abs(m.varPct))}
          </span>
          <span className="text-cs-gris-oscuro">vs forecast + ipc</span>
        </>
      }
    />
  )
}
