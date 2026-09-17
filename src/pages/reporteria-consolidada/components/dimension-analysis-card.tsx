import { useMemo, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { DIMENSIONES, type DimensionKey } from '../lib/dimensiones'
import { buildDimensionTree, sumDimNodes } from '../lib/build-dimension-tree'
import { flattenDimensionTree } from '../lib/flatten-dimension-tree'
import { useDimensionExpand } from '../lib/use-dimension-expand'
import { DimensionTableHeader } from './dimension-table-header'
import { DimensionRow, DimensionTotalRow } from './dimension-rows'

interface DimensionAnalysisCardProps {
  servicios: Servicio[]
  vista: CurrencyView
}

export function DimensionAnalysisCard({ servicios, vista }: DimensionAnalysisCardProps) {
  const [dim, setDim] = useState<DimensionKey>('rubro')
  const { expandedL1, onToggleL1, expandedL2, onToggleL2, reset } = useDimensionExpand()
  const unidad = vista === 'dolar' ? 'USD' : 'ML'

  const tree = useMemo(() => buildDimensionTree(servicios, dim, vista), [servicios, dim, vista])
  const totals = useMemo(() => sumDimNodes('Total', tree), [tree])
  const rows = flattenDimensionTree({ tree, expandedL1, onToggleL1, expandedL2, onToggleL2 })
  const dimLabel = DIMENSIONES.find((d) => d.key === dim)?.label ?? dim

  let leafIndex = 0

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="border-b border-border p-[14px_18px]">
        <div className="mb-0.5 text-[15px] font-bold text-foreground">🔍 Análisis por dimensión</div>
        <div className="text-xs text-muted-foreground">Elige el primer agrupador; se abre hasta Gerencia y Servicio, sin perder el total.</div>
      </div>
      <div className="flex flex-wrap gap-1 p-[10px_14px] border-b border-border">
        {DIMENSIONES.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => {
              setDim(d.key)
              reset()
            }}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[12.5px] font-semibold text-muted-foreground hover:bg-surface-hover',
              d.key === dim && 'bg-primary/10 text-primary',
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <DimensionTableHeader unit={` (${unidad})`} />
          <tbody>
            {rows.map((row) => (
              <DimensionRow
                key={row.key}
                row={row}
                zebra={row.depth === 2 ? leafIndex++ % 2 === 1 : false}
                nivelLabel={dimLabel}
                unidad={unidad}
                totalPlanFiltrado={totals.plan}
              />
            ))}
            <DimensionTotalRow totals={totals} unidad={unidad} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
