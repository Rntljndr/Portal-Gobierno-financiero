import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'
import { monthLabels } from '@/data/reporteria'
import { FORECAST_TAIL_COLS, FORECAST_TAIL_LABEL } from '../lib/forecast-resumen-labels'
import type { ForecastSortCol, SortDir } from '../lib/forecast-sort'
import { FORECAST_IDENTITY_COL_COUNT } from '../lib/forecast-identity-cols'
import { ForecastIdentityHeaderCells } from './forecast-identity-header-cells'
import { ForecastN7TailExtraHeaderCells } from './forecast-n7-tail-extra'

const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'

/** key por columna de FORECAST_TAIL_COLS — 'disponible' no es ordenable (no es un campo propio de
 * ResumenTotals, se deriva en el momento). */
const TAIL_SORT_COLS: (NonNullable<ForecastSortCol> | null)[] = ['plan', 'real', null, 'realMasForecast', 'desvio', 'pctDesvio']

interface ForecastTableHeaderProps {
  cutoff: number
  identityLabel: string
  variant: 'n4' | 'n7'
  sortCol: ForecastSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<ForecastSortCol>) => void
}

interface SortableProps {
  col: NonNullable<ForecastSortCol>
  label: string
  align?: 'left' | 'right' | 'center'
  bordL?: boolean
  bg?: string
  sortCol: ForecastSortCol
  sortDir: SortDir
  onSort: (col: NonNullable<ForecastSortCol>) => void
}

const ALIGN_TH: Record<NonNullable<SortableProps['align']>, string> = { left: 'min-w-[170px]', right: 'text-right', center: 'text-center' }
const ALIGN_BTN: Record<NonNullable<SortableProps['align']>, string> = { left: 'justify-start', right: 'flex-row-reverse', center: 'justify-center' }

function Sortable({ col, label, align = 'right', bordL, bg, sortCol, sortDir, onSort }: SortableProps) {
  const active = sortCol === col
  return (
    <th className={cn(th, bg, bordL && 'border-l-2 border-l-border', ALIGN_TH[align])}>
      <button type="button" onClick={() => onSort(col)} className={cn('inline-flex items-center gap-1 normal-case', ALIGN_BTN[align], active ? 'text-primary' : 'hover:text-primary')}>
        {label}
        <Icon name={active && sortDir === 'asc' ? 'chevron_up' : 'chevron_down'} size={10} color="currentColor" />
      </button>
    </th>
  )
}

/** Cabecera compartida por las tablas N4 y N7 de edición de Forecast — identidad copiada de
 * ForecastN4Historico/N7Historico (F) entre el nombre del servicio y los meses; el nombre y las
 * columnas de cierre (Ajuste T2) son ordenables, identidad y meses no (para no sumar ruido). */
export function ForecastTableHeader({ cutoff, identityLabel, variant, sortCol, sortDir, onSort }: ForecastTableHeaderProps) {
  const p = { sortCol, sortDir, onSort }
  const identityColCount = FORECAST_IDENTITY_COL_COUNT[variant]
  const tailExtraCount = variant === 'n7' ? 3 : 0

  return (
    <thead>
      <tr>
        <th colSpan={identityColCount} className={cn(th, 'sticky left-0 z-[2]')} />
        <th colSpan={cutoff} className={cn(thGroup, 'border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] text-primary')}>
          Real (YTD) · {monthLabels[0].slice(0, 3)}-{monthLabels[cutoff - 1].slice(0, 3)}
        </th>
        <th colSpan={12 - cutoff} className={cn(thGroup, 'border-l-2 border-l-[#CBD5E1] text-muted-foreground')}>
          Forecast (YTG) · {monthLabels[cutoff].slice(0, 3)}-{monthLabels[11].slice(0, 3)}
        </th>
        <th colSpan={FORECAST_TAIL_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border bg-primary/5 text-primary')}>
          {FORECAST_TAIL_LABEL}
        </th>
        {tailExtraCount > 0 && <th colSpan={tailExtraCount} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')} />}
      </tr>
      <tr>
        <Sortable col="nombre" label={identityLabel} align="left" {...p} />
        <ForecastIdentityHeaderCells variant={variant} />
        {monthLabels.map((label, i) => {
          const closed = i < cutoff
          return (
            <th
              key={label}
              className={cn(
                'min-w-[62px] p-[8px_4px_6px] text-right text-[11px] font-bold whitespace-nowrap border-b-2',
                closed ? 'border-b-[#C4DFFF] bg-primary/5 text-primary' : 'border-b-border bg-[#F8F9FD] text-muted-foreground',
                i === 0 && (closed ? 'border-l-2 border-l-[#C4DFFF]' : 'border-l-2 border-l-[#CBD5E1]'),
                i === cutoff && 'border-l-2 border-l-[#CBD5E1]',
              )}
            >
              <div>{label.slice(0, 3)}</div>
              <div className="mt-px text-[8px] font-semibold opacity-75">{closed ? 'Real' : 'FC'}</div>
            </th>
          )
        })}
        {FORECAST_TAIL_COLS.map((c, i) => {
          const col = TAIL_SORT_COLS[i]
          const align = c.key === 'pctDesvio' ? 'center' : 'right'
          return col ? (
            <Sortable key={c.key} col={col} label={c.label} align={align} bg="bg-primary/5 text-primary" bordL={i === 0} {...p} />
          ) : (
            <th key={c.key} className={cn(th, 'bg-primary/5 text-primary', i === 0 && 'border-l-2 border-l-border', ALIGN_TH[align])}>
              {c.label}
            </th>
          )
        })}
        {variant === 'n7' && <ForecastN7TailExtraHeaderCells />}
      </tr>
    </thead>
  )
}
