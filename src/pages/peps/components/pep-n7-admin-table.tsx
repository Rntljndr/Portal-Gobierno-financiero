import { cn } from '@/shared/lib/utils'
import { EmptyState, Icon } from '@/shared/ui'
import type { PepN7Row } from '@/data/peps'
import type { N7SortColumn, N7SortDir } from '../lib/sort-pep-n7'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap bg-[#FAFBFE]'
const td = 'p-[10px_14px] text-[12.5px] align-top whitespace-nowrap'

interface SortableHeaderProps {
  col: NonNullable<N7SortColumn>
  label: string
  sortCol: N7SortColumn
  sortDir: N7SortDir
  onSort: (col: NonNullable<N7SortColumn>) => void
}

function SortableHeader({ col, label, sortCol, sortDir, onSort }: SortableHeaderProps) {
  const active = sortCol === col
  const isAsc = active && sortDir === 'asc'
  return (
    <th className={cn(th, active && 'text-primary')}>
      <span className="inline-flex items-center gap-1">
        {label}
        <button type="button" onClick={() => onSort(col)} aria-label="Ordenar" className={cn('rounded p-0.5 text-muted-foreground hover:bg-[#E8EEFB]', active && 'font-bold text-primary')}>
          {isAsc ? '↑' : '↓'}
        </button>
      </span>
    </th>
  )
}

interface PepN7AdminTableProps {
  rows: PepN7Row[]
  sortCol: N7SortColumn
  sortDir: N7SortDir
  onSort: (col: NonNullable<N7SortColumn>) => void
  onEdit: (row: PepN7Row) => void
  onDelete: (row: PepN7Row) => void
}

export function PepN7AdminTable({ rows, sortCol, sortDir, onSort, onEdit, onDelete }: PepN7AdminTableProps) {
  const sortProps = { sortCol, sortDir, onSort }

  if (rows.length === 0) {
    return (
      <div className="mb-2">
        <EmptyState icon="search" title="Sin PEP N7 asignados para este PEP N4." text="Creá el primero con el botón “Crear PEP N7”." />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <SortableHeader col="servicio" label="Servicio" {...sortProps} />
              <SortableHeader col="cod" label="Código PEP" {...sortProps} />
              <SortableHeader col="bandera" label="Bandera" {...sortProps} />
              <SortableHeader col="destino" label="Destino" {...sortProps} />
              <SortableHeader col="ceco" label="Centro de costo" {...sortProps} />
              <th className={cn(th, 'text-center')}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cod} className="border-t border-border hover:bg-[#FBFCFE]">
                <td className={cn(td, 'max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap')} title={r.servicio}>
                  {r.servicio}
                </td>
                <td className={td}>{r.cod}</td>
                <td className={cn(td, 'text-center text-base')}>{r.bandera}</td>
                <td className={cn(td, 'max-w-[160px] overflow-hidden text-ellipsis')}>{r.destino}</td>
                <td className={td}>{r.ceco}</td>
                <td className={`${td} text-center`}>
                  <div className="flex justify-center gap-1">
                    <button type="button" title="Editar" onClick={() => onEdit(r)} className="inline-flex size-7 items-center justify-center rounded-md text-primary hover:bg-[#E8EEFB]">
                      <Icon name="edit" size={13} color="currentColor" />
                    </button>
                    <button type="button" title="Eliminar" onClick={() => onDelete(r)} className="inline-flex size-7 items-center justify-center rounded-md text-[#B42318] hover:bg-[#FEE8E8]">
                      <Icon name="trash" size={13} color="currentColor" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
