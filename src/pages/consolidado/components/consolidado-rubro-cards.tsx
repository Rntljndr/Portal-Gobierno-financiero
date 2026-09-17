import { useMemo } from 'react'
import type { Pais, Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { Icon, KpiCard } from '@/shared/ui'
import { formatNumber, formatPercentCL } from '@/shared/lib/format'
import { buildDimensionTree, sumDimNodes, countLeaves, type DimNode } from '../lib/build-dimension-tree'
import { computeDimMetrics } from '../lib/dimension-metrics'

interface ConsolidadoRubroCardsProps {
  servicios: Servicio[]
  vista: CurrencyView
  paisMoneda: Pais | null
}

const ZERO: Pick<DimNode, 'plan' | 'fBase' | 'fIPC' | 'children'> = { plan: 0, fBase: 0, fIPC: 0, children: [] }

/**
 * Mismos 4 campos que el prototipo real: Total Plan, Amortización, Nómina, Servicios.
 * SIP hoy no modela líneas de Nómina ni Amortización como "servicios" (no existen en este fixture) —
 * quedan en 0 líneas, igual a como el propio prototipo real ya muestra "Sin origen informado" en US$0
 * cuando una categoría existe pero no tiene líneas. "Servicios" agrupa el 100% de los rubros reales
 * de SIP (Software, Hardware, Servicios, Consultoría), siguiendo la misma regla de fold que usa el original.
 */
export function ConsolidadoRubroCards({ servicios, vista, paisMoneda }: ConsolidadoRubroCardsProps) {
  const tree = useMemo(() => buildDimensionTree(servicios, 'rubro', vista, paisMoneda), [servicios, vista, paisMoneda])
  const total = useMemo(() => sumDimNodes('Total Plan', tree), [tree])
  const totalLineas = tree.reduce((a, n) => a + countLeaves(n), 0)

  const amortizacion: DimNode = { nombre: 'Amortización', ...ZERO }
  const nomina: DimNode = { nombre: 'Nómina', ...ZERO }
  const serviciosNode: DimNode = { nombre: 'Servicios', plan: total.plan, fBase: total.fBase, fIPC: total.fIPC, children: [] }

  return (
    <div>
      <div className="mb-2.5">
        <div className="text-[15px] font-bold text-foreground">Resumen por rubro</div>
        <div className="text-xs text-muted-foreground">Monto general del plan por rubro (Servicios, Nómina y Amortización), según los filtros aplicados.</div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <RubroTile nombre="Total Plan" node={total} total={total} lineas={totalLineas} highlight />
        <RubroTile nombre="Amortización" node={amortizacion} total={total} lineas={0} />
        <RubroTile nombre="Nómina" node={nomina} total={total} lineas={0} />
        <RubroTile nombre="Servicios" node={serviciosNode} total={total} lineas={totalLineas} />
      </div>
    </div>
  )
}

function RubroTile({ nombre, node, total, lineas, highlight }: { nombre: string; node: DimNode; total: DimNode; lineas: number; highlight?: boolean }) {
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
            {m.varMonto > 0 ? '▲' : m.varMonto < 0 ? '▼' : ''} {formatPercentCL(Math.abs(m.varPct))}
          </span>
          <span className="text-cs-gris-oscuro">vs. forecast + IPC</span>
          {!highlight && <span className="text-muted-foreground">· {formatPercentCL(m.pctPlan)} · {lineas} líneas</span>}
        </>
      }
    />
  )
}
