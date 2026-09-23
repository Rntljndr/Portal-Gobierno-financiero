import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { CurrencyView } from '@/data/reporteria'
import type { DireccionSortCol, SortDir } from '../lib/sort-direccion-tree'

const thBase = 'p-[9px_10px] text-[12px] font-medium tracking-[0.02em] text-cs-gris-oscuro uppercase whitespace-nowrap bg-[#F8FAFC] border-b-2 border-border-table-strong'
const th = `${thBase} text-right`

interface DireccionTableHeaderProps {
  vista: CurrencyView
  sortCol: DireccionSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<DireccionSortCol>) => void
}

interface SortableProps {
  col: NonNullable<DireccionSortCol>
  label: string
  align?: 'left' | 'right'
  bordL?: boolean
  sortCol: DireccionSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<DireccionSortCol>) => void
}

function Sortable({ col, label, align = 'right', bordL, sortCol, sortDir, onSort }: SortableProps) {
  const active = sortCol === col
  return (
    <th className={cn(align === 'left' ? thBase : th, align === 'left' && 'min-w-[240px]', bordL && 'border-l border-border-table')}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn('inline-flex items-center gap-1 normal-case', align === 'left' ? 'justify-start' : 'flex-row-reverse', active ? 'text-primary' : 'hover:text-primary')}
      >
        {label}
        <Icon name={active && sortDir === 'asc' ? 'chevron_up' : 'chevron_down'} size={11} color="currentColor" />
      </button>
    </th>
  )
}

export function DireccionTableHeader({ vista, sortCol, sortDir, onSort }: DireccionTableHeaderProps) {
  const unit = vista === 'dolar' ? ' (US$)' : ' (ML)'
  const p = { sortCol, sortDir, onSort }
  return (
    <thead>
      <tr>
        <Sortable col="nombre" label="País" align="left" {...p} />
        <Sortable col="real" label={`Total Real${unit}`} bordL {...p} />
        <Sortable col="sIngresosReal" label="S/Ingresos" {...p} />
        <Sortable col="plan" label={`Total Plan${unit}`} bordL {...p} />
        <Sortable col="sIngresosPlan" label="S/ingresos" {...p} />
        <Sortable col="varVsPlan" label={`Var. vs Plan${unit}`} bordL {...p} />
        <Sortable col="varPct" label="Var. %" {...p} />
        <Sortable col="realAnterior" label={`Año Anterior${unit}`} bordL {...p} />
        <Sortable col="sIngresosAnterior" label="S/Ingresos" {...p} />
        <Sortable col="varAA" label={`Var. Vs A/A${unit}`} bordL {...p} />
        <Sortable col="varAAPct" label="Var. A/A %" {...p} />
      </tr>
    </thead>
  )
}
