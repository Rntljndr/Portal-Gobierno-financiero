import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { DimSortCol, SortDir } from '../lib/sort-dim-tree'

const thBase = 'p-[9px_10px] text-[12px] font-medium tracking-[0.02em] text-cs-gris-oscuro uppercase whitespace-nowrap bg-[#F8FAFC] border-b-2 border-border-table-strong'
const th = `${thBase} text-right`

interface ConsolidadoTableHeaderProps {
  firstColLabel: string
  unit: string
  sortCol: DimSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<DimSortCol>) => void
}

interface SortableProps {
  col: NonNullable<DimSortCol>
  label: string
  align?: 'left' | 'right'
  bordL?: boolean
  sortCol: DimSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<DimSortCol>) => void
}

function Sortable({ col, label, align = 'right', bordL, sortCol, sortDir, onSort }: SortableProps) {
  const active = sortCol === col
  return (
    <th className={cn(align === 'left' ? thBase : th, align === 'left' && 'min-w-[240px]', bordL && 'border-l border-border-table')}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn(
          'inline-flex items-center gap-1 normal-case',
          align === 'left' ? 'justify-start' : 'flex-row-reverse',
          active ? 'text-primary' : 'hover:text-primary',
        )}
      >
        {label}
        <Icon name={active && sortDir === 'asc' ? 'chevron_up' : 'chevron_down'} size={11} color="currentColor" />
      </button>
    </th>
  )
}

export function ConsolidadoTableHeader({ firstColLabel, unit, sortCol, sortDir, onSort }: ConsolidadoTableHeaderProps) {
  const p = { sortCol, sortDir, onSort }
  return (
    <thead>
      <tr>
        <Sortable col="nombre" label={firstColLabel} align="left" {...p} />
        <Sortable col="plan" label={`Plan${unit}`} bordL {...p} />
        <Sortable col="fIPC" label={`Forecast + IPC${unit}`} {...p} />
        <Sortable col="varMonto" label={`Variación${unit}`} {...p} />
        <Sortable col="varPct" label="Variación %" {...p} />
        <Sortable col="pctPlan" label="% del Plan" bordL {...p} />
      </tr>
    </thead>
  )
}
