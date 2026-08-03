import { cn } from '@/shared/lib/utils'
import type { SortColumn, SortDir } from '../lib/sort-services'

const th = 'p-[12px_14px] text-left text-[10.5px] font-bold tracking-[0.05em] text-muted-foreground uppercase whitespace-nowrap bg-[#FAFBFE]'

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
          onClick={(e) => {
            e.stopPropagation()
            onSort(col)
          }}
          aria-label="Ordenar"
          className={cn('rounded p-0.5 text-muted-foreground hover:bg-[#E8EEFB]', active && 'font-bold text-primary')}
        >
          {isAsc ? '↑' : '↓'}
        </button>
      </span>
    </th>
  )
}

interface ServicesTableHeaderProps {
  sortCol: SortColumn
  sortDir: SortDir
  onSort: (col: NonNullable<SortColumn>) => void
}

export function ServicesTableHeader({ sortCol, sortDir, onSort }: ServicesTableHeaderProps) {
  return (
    <thead>
      <tr>
        <th className={cn(th, 'w-9 pl-4')} />
        <th className={th}>Servicio</th>
        <SortableHeader col="pais" label="País" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <SortableHeader col="equipo" label="Equipo" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <SortableHeader col="tipoOrigen" label="Tipo" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <SortableHeader col="dolarizado" label="S. en Dólar" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
        <th className={cn(th, 'text-right')}>Plan</th>
        <th className={cn(th, 'text-right')}>Forecast Base</th>
        <th className={cn(th, 'text-right')}>Forecast + IPC</th>
        <th className={cn(th, 'text-right')}>Variación $</th>
        <th className={cn(th, 'text-right')}>Variación %</th>
        <th className={th}>Acciones</th>
      </tr>
    </thead>
  )
}
