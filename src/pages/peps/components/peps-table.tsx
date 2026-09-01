import { cn } from '@/shared/lib/utils'
import { EmptyState, Icon } from '@/shared/ui'
import type { PepN4Row } from '@/data/peps'
import type { SortColumn, SortDir } from '../lib/sort-peps'

const th = 'p-[10px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap bg-[#FAFBFE]'
const td = 'p-[10px_14px] text-[12.5px] align-top whitespace-nowrap'

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface SortableHeaderProps {
  col: NonNullable<SortColumn>
  label: string
  sortCol: SortColumn
  sortDir: SortDir
  onSort: (col: NonNullable<SortColumn>) => void
}

function SortableHeader({ col, label, sortCol, sortDir, onSort }: SortableHeaderProps) {
  const active = sortCol === col
  const isAsc = active && sortDir === 'asc'
  return (
    <th className={cn(th, active && 'text-primary')}>
      <span className="inline-flex items-center gap-1">
        {label}
        <button
          type="button"
          onClick={() => onSort(col)}
          aria-label="Ordenar"
          className={cn('rounded p-0.5 text-muted-foreground hover:bg-[#E8EEFB]', active && 'font-bold text-primary')}
        >
          {isAsc ? '↑' : '↓'}
        </button>
      </span>
    </th>
  )
}

interface PepsTableProps {
  rows: PepN4Row[]
  sortCol: SortColumn
  sortDir: SortDir
  onSort: (col: NonNullable<SortColumn>) => void
  onEdit: (row: PepN4Row) => void
}

export function PepsTable({ rows, sortCol, sortDir, onSort, onEdit }: PepsTableProps) {
  const sortProps = { sortCol, sortDir, onSort }

  if (rows.length === 0) {
    return (
      <div className="mx-8 mb-4">
        <EmptyState icon="search" title="Sin resultados para los filtros aplicados" text="Probá ajustar los filtros." />
      </div>
    )
  }

  return (
    <div className="mx-8 mb-4 overflow-hidden rounded-xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <SortableHeader col="pep" label="PEP" {...sortProps} />
              <SortableHeader col="pais" label="País" {...sortProps} />
              <SortableHeader col="moneda" label="Moneda" {...sortProps} />
              <SortableHeader col="cod" label="Cód." {...sortProps} />
              <SortableHeader col="servicio" label="Servicio" {...sortProps} />
              <SortableHeader col="area" label="Área" {...sortProps} />
              <SortableHeader col="cuenta" label="Cta. contable" {...sortProps} />
              <SortableHeader col="fechaCreacion" label="F. creación" {...sortProps} />
              <SortableHeader col="ultimaEdicion" label="Últ. edición" {...sortProps} />
              <th className={cn(th, 'text-center')}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pep} className="border-t border-border hover:bg-[#FBFCFE]">
                <td className={`${td} font-semibold text-foreground`}>{r.pep}</td>
                <td className={td}>{r.pais}</td>
                <td className={td}>{r.moneda}</td>
                <td className={`${td} text-center`}>{r.cod}</td>
                <td className={cn(td, 'max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap text-cs-gris-oscuro')} title={r.servicio}>
                  {r.servicio}
                </td>
                <td className={`${td} text-cs-gris-oscuro`}>{r.area}</td>
                <td className={`${td} text-cs-gris-oscuro`}>{r.cuenta}</td>
                <td className={`${td} text-cs-gris-oscuro`}>{formatFecha(r.fechaCreacion)}</td>
                <td className={td}>
                  <div className="font-medium text-foreground">{formatFecha(r.ultimaEdicion.fecha)}</div>
                  <div className="text-[11px] text-muted-foreground">{r.ultimaEdicion.usuario}</div>
                </td>
                <td className={`${td} text-center`}>
                  <button
                    type="button"
                    title="Editar PEP N4"
                    onClick={() => onEdit(r)}
                    className="inline-flex size-7 items-center justify-center rounded-md text-primary hover:bg-[#E8EEFB]"
                  >
                    <Icon name="edit" size={13} color="currentColor" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
