import type { DireccionPais, DireccionLeaf } from '@/data/reporte-direccion'
import { useDireccionExpand } from '../lib/use-direccion-expand'
import { flattenDireccionTree } from '../lib/flatten-tree'
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
  const { expandedPais, onTogglePais, expandedDivision, onToggleDivision } = useDireccionExpand()
  const rows = flattenDireccionTree({ tree, expandedPais, onTogglePais, expandedDivision, onToggleDivision })

  let banderaIndex = 0

  return (
    <div className="mx-8 mb-8 overflow-hidden rounded-xl border border-border-table-strong bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <DireccionTableHeader vista={vista} />
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
            <DireccionTotalRow totals={totals} vista={vista} vistaNumero={vistaNumero} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
