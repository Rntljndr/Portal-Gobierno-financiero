import { useMemo, useState } from 'react'
import type { DireccionPais, DireccionLeaf } from '@/data/reporte-direccion'
import { useDireccionExpand } from '../lib/use-direccion-expand'
import { flattenDireccionTree } from '../lib/flatten-tree'
import { sortDireccionTree, type DireccionSortCol, type SortDir } from '../lib/sort-direccion-tree'
import type { CurrencyView } from '@/data/reporteria'
import type { VistaNumero } from '@/shared/ui'
import { DireccionTableHeader } from './direccion-table-header'
import { DireccionRow, DireccionTotalRow } from './direccion-rows'

interface DireccionTableProps {
  tree: DireccionPais[]
  totals: DireccionLeaf
  vista: CurrencyView
  vistaNumero: VistaNumero
}

export function DireccionTable({ tree, totals, vista, vistaNumero }: DireccionTableProps) {
  const { expandedPais, onTogglePais, expandedDivision, onToggleDivision, expandAll, collapseAll } = useDireccionExpand()
  const [sortCol, setSortCol] = useState<DireccionSortCol>(null)
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const onSort = (col: NonNullable<DireccionSortCol>) => {
    if (sortCol !== col) {
      setSortCol(col)
      setSortDir('desc')
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    }
  }

  const sortedTree = useMemo(() => sortDireccionTree(tree, sortCol, sortDir), [tree, sortCol, sortDir])
  const rows = flattenDireccionTree({ tree: sortedTree, expandedPais, onTogglePais, expandedDivision, onToggleDivision })

  const paisKeys = useMemo(() => tree.filter((p) => p.divisiones.length > 0).map((p) => p.nombre), [tree])
  const divisionKeys = useMemo(
    () => tree.flatMap((p) => p.divisiones.filter((d) => d.banderas.length > 0).map((d) => `${p.nombre}|${d.nombre}`)),
    [tree],
  )
  const allExpanded = paisKeys.length > 0 && paisKeys.every((k) => expandedPais[k]) && divisionKeys.every((k) => expandedDivision[k])
  const onExpandAll = () => (allExpanded ? collapseAll() : expandAll(paisKeys, divisionKeys))

  let banderaIndex = 0

  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-xl border border-border-table-strong bg-white">
      <div className="flex items-center justify-end border-b border-border p-[10px_14px]">
        <button type="button" onClick={onExpandAll} className="text-[12px] font-semibold text-primary hover:underline">
          {allExpanded ? 'Contraer todo' : 'Expandir todo'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <DireccionTableHeader vista={vista} sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
          <tbody>
            {rows.map((row) => (
              <DireccionRow
                key={row.key}
                row={row}
                zebra={row.type === 'bandera' ? banderaIndex++ % 2 === 1 : false}
                vista={vista}
                vistaNumero={vistaNumero}
              />
            ))}
            {vista !== 'destino' && <DireccionTotalRow totals={totals} vista={vista} vistaNumero={vistaNumero} />}
          </tbody>
        </table>
      </div>
    </div>
  )
}
