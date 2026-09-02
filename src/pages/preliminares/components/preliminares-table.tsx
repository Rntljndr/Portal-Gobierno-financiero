import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/ui'
import type { PreliminarN4Row, PreliminarRow } from '@/data/preliminares'
import { PreliminaresTableRow } from './preliminares-table-row'
import { n4RowSelectState } from '../lib/n4-row-select-state'
import { SubPepDrawer } from './subpep-drawer'
import { PreliminaresTableHead } from './preliminares-table-head'

type Row = (PreliminarRow & { parentServicio?: string }) | PreliminarN4Row

interface PreliminaresTableProps {
  rows: Row[]
  isN7: boolean
  onRowClick?: (row: PreliminarRow) => void
  itemLabel: string
  mesLabel: string
  selectable?: boolean
  selected?: Set<string>
  onToggleSelect?: (codigo: string) => void
  onToggleSelectN4?: (row: PreliminarN4Row) => void
}

export function PreliminaresTable({
  rows,
  isN7,
  onRowClick,
  itemLabel,
  mesLabel,
  selectable = false,
  selected = new Set(),
  onToggleSelect,
  onToggleSelectN4,
}: PreliminaresTableProps) {
  const [subPepRow, setSubPepRow] = useState<PreliminarRow | null>(null)

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-6">
        <EmptyState icon="filter" title="Sin resultados con los filtros aplicados" text="Ajustá o limpiá los filtros para ver datos." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-xs">
        <PreliminaresTableHead isN7={isN7} selectable={selectable} mesLabel={mesLabel} />
        <tbody>
          {rows.map((row) => {
            const isN4WithChildren = 'children' in row
            const triState = isN4WithChildren && selectable ? n4RowSelectState(row, selected) : null
            return (
              <PreliminaresTableRow
                key={row.codigo}
                row={row}
                isN7={isN7}
                onRowClick={onRowClick}
                selectable={selectable}
                checked={triState ? triState.checked : selected.has(row.codigo)}
                indeterminate={triState?.indeterminate}
                checkDisabled={triState ? triState.disabled : undefined}
                onToggleSelect={() => (isN4WithChildren ? onToggleSelectN4?.(row) : onToggleSelect?.(row.codigo))}
                onOpenSubPeps={setSubPepRow}
              />
            )
          })}
        </tbody>
        <tfoot>
          <tr className={cn('border-t-2 border-border bg-[#FAFBFE] font-bold')}>
            <td colSpan={(isN7 ? 13 : 7) + (selectable ? 1 : 0)} className="p-[10px_14px] text-[12.5px] text-foreground">
              Total · {rows.length} {itemLabel}
            </td>
            <td colSpan={7} className="p-[10px_14px] border-l-2 border-l-primary/20 text-center text-xs text-muted-foreground">
              Monedas mixtas — ver por servicio
            </td>
          </tr>
        </tfoot>
      </table>
      <SubPepDrawer n7={subPepRow} onClose={() => setSubPepRow(null)} />
    </div>
  )
}
