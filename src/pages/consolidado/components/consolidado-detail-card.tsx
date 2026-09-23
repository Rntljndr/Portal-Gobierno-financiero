import { useMemo, useState } from 'react'
import { Button, Icon } from '@/shared/ui'
import { paisMoneda as paisMonedaMap, type Pais, type Servicio } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'
import { DIMENSION_LEVELS, LEAF_LABEL, type DimensionKey } from '../lib/dimensiones'
import { buildDimensionTree, sumDimNodes, type DimNode } from '../lib/build-dimension-tree'
import { useDimensionSort } from '../lib/use-dimension-sort'
import { flattenDimensionTree } from '../lib/flatten-dimension-tree'
import { useDimensionExpand } from '../lib/use-dimension-expand'
import { buildServicioLineas } from '../lib/consolidado-servicio-lineas'
import { ConsolidadoTableHeader } from './consolidado-table-header'
import { ConsolidadoRow, ConsolidadoTotalRow } from './consolidado-rows'
import { ConsolidadoDimensionTabs } from './consolidado-dimension-tabs'
import { ConsolidadoServicioTable } from './consolidado-servicio-table'
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

/** Cada pestaña abre su propia cadena de niveles de negocio antes de llegar a la hoja final (ver
 * `DIMENSION_LEVELS`/`LEAF_LABEL`); Servicio es la excepción y usa una tabla plana de línea PEP. */
export function ConsolidadoDetailCard({ servicios, vista, paisMoneda }: ConsolidadoDetailCardProps) {
  const [dim, setDim] = useState<DimensionKey>('paisDestino')
  const { expanded, onToggle, reset, expandAll: expandAllKeys } = useDimensionExpand()
  const unidad = vista === 'dolar' ? ' USD' : paisMoneda ? ` ${paisMonedaMap[paisMoneda]}` : ' ML'

  const esServicio = dim === 'servicio'
  const levels = DIMENSION_LEVELS[dim]
  const leafLabel = LEAF_LABEL[dim]
  const levelLabels = useMemo(() => levels.map((l) => l.label), [levels])
  const baseTree = useMemo(() => buildDimensionTree(servicios, dim, vista, paisMoneda), [servicios, dim, vista, paisMoneda])
  const totals = useMemo(() => sumDimNodes('Total según filtros', baseTree), [baseTree])
  const { tree, sortCol, sortDir, onSort, resetSort } = useDimensionSort(baseTree, totals.plan)
  const rows = flattenDimensionTree({ tree, expanded, onToggle, maxDepth: levels.length })
  const lineas = useMemo(() => (esServicio ? buildServicioLineas(servicios, vista, paisMoneda) : []), [esServicio, servicios, vista, paisMoneda])

  const groupKeys = useMemo(() => collectGroupKeys(tree, levels.length, 0, ''), [tree, levels.length])
  const allExpanded = groupKeys.length > 0 && groupKeys.every((k) => expanded[k])
  const toggleExpandAll = () => (allExpanded ? reset() : expandAllKeys(groupKeys))

  let leafIndex = 0

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-[14px_18px]">
        <div>
          <div className="text-[15px] font-bold text-foreground">Detalle del presupuesto consolidado</div>
          <div className="text-xs text-muted-foreground">Agrupa el presupuesto por país, división, gerencia, equipo, servicio, rubro, tipo de gasto o justificación de desvío.</div>
        </div>
        {!esServicio && (
          <Button variant="outline" size="sm" onClick={() => downloadConsolidadoCsv(rows, levelLabels, leafLabel, vista)}>
            <Icon name="download" size={12} color="#0047B0" /> Descargar selección
          </Button>
        )}
      </div>
      <ConsolidadoDimensionTabs
        dim={dim}
        onChangeDim={(d) => {
          setDim(d)
          resetSort()
          reset()
        }}
        showExpandAll={!esServicio}
        allExpanded={allExpanded}
        onExpandAll={toggleExpandAll}
      />
      {esServicio ? (
        <ConsolidadoServicioTable rows={lineas} />
      ) : (
        <>
          <div className="p-[8px_18px] text-xs text-muted-foreground">{levelLabels.join(' → ')} → {leafLabel}</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <ConsolidadoTableHeader
                firstColLabel={levelLabels[0]}
                unit={unidad}
                sortCol={sortCol}
                sortDir={sortDir}
                onSort={(col) => {
                  onSort(col)
                  reset()
                }}
              />
              <tbody>
                {rows.map((row) => (
                  <ConsolidadoRow
                    key={row.key}
                    row={row}
                    zebra={row.depth === levels.length ? leafIndex++ % 2 === 1 : false}
                    levelLabels={levelLabels}
                    leafLabel={leafLabel}
                    totalPlanFiltrado={totals.plan}
                  />
                ))}
                <ConsolidadoTotalRow totals={totals} label="Total según filtros" />
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="p-[10px_18px] text-xs text-muted-foreground">Todas las vistas usan la misma selección. Los servicios se agrupan por PEP N4, respetando sus asignaciones de destino.</div>
    </div>
  )
}
