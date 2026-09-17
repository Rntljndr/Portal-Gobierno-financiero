import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/ui'
import { monthKeys, monthLabelsShort } from '@/data/reporteria'
import type { IngresoRow } from '../lib/use-ingresos'
import type { SortColumn, SortDir } from '../lib/sort-ingresos'
import { IngresosRow } from './ingresos-row'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap bg-[#FAFBFE]'
const thNum = `${th} text-right`

interface SortHeaderContentProps {
  col: NonNullable<SortColumn>
  label: string
  align?: 'left' | 'right'
  sortCol: SortColumn
  sortDir: SortDir
  onSort: (col: NonNullable<SortColumn>) => void
}

function SortHeaderContent({ col, label, align = 'left', sortCol, sortDir, onSort }: SortHeaderContentProps) {
  const active = sortCol === col
  const isAsc = active && sortDir === 'asc'
  return (
    <span className={cn('inline-flex items-center gap-1', align === 'right' && 'flex-row-reverse', active && 'text-primary')}>
      {label}
      <button type="button" onClick={() => onSort(col)} aria-label="Ordenar" className="rounded p-0.5 hover:bg-[#E8EEFB]">
        {isAsc ? '↑' : '↓'}
      </button>
    </span>
  )
}

function SortableHeader(props: SortHeaderContentProps) {
  return (
    <th className={props.align === 'right' ? thNum : th}>
      <SortHeaderContent {...props} />
    </th>
  )
}

interface IngresosTableProps {
  ejercicio: number
  rows: IngresoRow[]
  sortCol: SortColumn
  sortDir: SortDir
  onSort: (col: NonNullable<SortColumn>) => void
  editingRows: Set<string>
  onToggleEditar: (bandera: string) => void
  onEditMes: (bandera: string, mesKey: string, valor: number) => void
}

export function IngresosTable({ ejercicio, rows, sortCol, sortDir, onSort, editingRows, onToggleEditar, onEditMes }: IngresosTableProps) {
  const sortProps = { sortCol, sortDir, onSort }

  return (
    <div className="mx-8 mb-4 overflow-hidden rounded-xl border border-border bg-white">
      <div className="border-b border-border p-[14px_18px]">
        <div className="text-[15px] font-bold text-primary">Ingresos {ejercicio}</div>
        <div className="text-xs text-muted-foreground">Montos en moneda local.</div>
      </div>

      {rows.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="search" title={`Sin ingresos cargados para ${ejercicio}`} text="Agregá un registro o importá un Excel para empezar." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={cn(th, 'sticky left-0 z-[2] bg-[#FAFBFE]')}>
                  <SortHeaderContent col="pais" label="País" {...sortProps} />
                </th>
                <SortableHeader col="division" label="División" {...sortProps} />
                <SortableHeader col="bandera" label="Bandera" {...sortProps} />
                <SortableHeader col="codigo" label="Código" {...sortProps} />
                {monthKeys.map((k, i) => (
                  <SortableHeader key={k} col={k} label={monthLabelsShort[i]} align="right" {...sortProps} />
                ))}
                <SortableHeader col="total" label="Total" align="right" {...sortProps} />
                <th className={cn(th, 'text-center')}>Edición</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <IngresosRow
                  key={row.maestro.nombre}
                  row={row}
                  editando={editingRows.has(row.maestro.nombre)}
                  onEditMes={onEditMes}
                  onToggleEditar={onToggleEditar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
