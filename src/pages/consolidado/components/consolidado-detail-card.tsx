import { useMemo, useState } from 'react'
import { Button, Icon } from '@/shared/ui'
import { paisMoneda as paisMonedaMap, type Pais, type Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { DIMENSION_LEVELS, type DimensionKey } from '../lib/dimensiones'
import { buildDimensionTree, sumDimNodes, type DimNode } from '../lib/build-dimension-tree'
import { flattenDimensionTree } from '../lib/flatten-dimension-tree'
import { useDimensionExpand } from '../lib/use-dimension-expand'
import { ConsolidadoTableHeader } from './consolidado-table-header'
import { ConsolidadoRow, ConsolidadoTotalRow } from './consolidado-rows'
import { ConsolidadoDimensionTabs } from './consolidado-dimension-tabs'
import { downloadConsolidadoCsv } from '../lib/download-csv'

interface ConsolidadoDetailCardProps {
  servicios: Servicio[]
  vista: CurrencyView
  paisMoneda: Pais | null
}

function collectGroupKeys(nodes: DimNode[], maxDepth: number, depth: number, prefix: string): string[] {
  if (depth === maxDepth) return []
  return nodes.flatMap((n) => {
    const key = prefix ? `${prefix}|${n.nombre}` : n.nombre
    return [key, ...collectGroupKeys(n.children, maxDepth, depth + 1, key)]
  })
}

/** Cada pestaña abre su propia cadena de niveles de negocio (2 a 4 niveles, ver DIMENSION_LEVELS)
 * antes de llegar siempre al PEP N4 como hoja final. */
export function ConsolidadoDetailCard({ servicios, vista, paisMoneda }: ConsolidadoDetailCardProps) {
  const [dim, setDim] = useState<DimensionKey>('paisDestino')
  const { expanded, onToggle, reset, expandAll: expandAllKeys } = useDimensionExpand()
  const unidad = vista === 'dolar' ? ' USD' : paisMoneda ? ` ${paisMonedaMap[paisMoneda]}` : ' ML'

  const levels = DIMENSION_LEVELS[dim]
  const levelLabels = useMemo(() => levels.map((l) => l.label), [levels])
  const tree = useMemo(() => buildDimensionTree(servicios, dim, vista, paisMoneda), [servicios, dim, vista, paisMoneda])
  const totals = useMemo(() => sumDimNodes('Total según filtros', tree), [tree])
  const rows = flattenDimensionTree({ tree, expanded, onToggle, maxDepth: levels.length })

  const groupKeys = useMemo(() => collectGroupKeys(tree, levels.length, 0, ''), [tree, levels.length])
  const allExpanded = groupKeys.length > 0 && groupKeys.every((k) => expanded[k])
  const toggleExpandAll = () => (allExpanded ? reset() : expandAllKeys(groupKeys))

  let leafIndex = 0

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-[14px_18px]">
        <div>
          <div className="text-[15px] font-bold text-foreground">Detalle del presupuesto consolidado</div>
          <div className="text-xs text-muted-foreground">Agrupa el presupuesto por país destino, división, gerencia, servicio, rubro o tipo de gasto.</div>
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadConsolidadoCsv(rows, levelLabels, vista)}>
          <Icon name="download" size={12} color="#0047B0" /> Descargar selección
        </Button>
      </div>
      <ConsolidadoDimensionTabs
        dim={dim}
        onChangeDim={(d) => {
          setDim(d)
          reset()
        }}
        showExpandAll
        allExpanded={allExpanded}
        onExpandAll={toggleExpandAll}
      />
      <div className="p-[8px_18px] text-xs text-muted-foreground">{levelLabels.join(' → ')} → PEP N4</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <ConsolidadoTableHeader leafLabel="PEP N4" unit={unidad} />
          <tbody>
            {rows.map((row) => (
              <ConsolidadoRow
                key={row.key}
                row={row}
                zebra={row.depth === levels.length ? leafIndex++ % 2 === 1 : false}
                levelLabels={levelLabels}
                totalPlanFiltrado={totals.plan}
              />
            ))}
            <ConsolidadoTotalRow totals={totals} label="Total según filtros" />
          </tbody>
        </table>
      </div>
      <div className="p-[10px_18px] text-xs text-muted-foreground">Todas las vistas usan la misma selección. Los servicios se agrupan por PEP N4, respetando sus asignaciones de destino.</div>
    </div>
  )
}
