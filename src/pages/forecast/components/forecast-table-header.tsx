import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'
import { monthLabels } from '@/data/reporteria'
import { PROYECCION_ANUAL_COLS, PROYECCION_ANUAL_LABEL, resumenAcumuladoLabel, RESUMEN_ACUMULADO_COLS } from '@/shared/lib/resumen-blocks'
import type { ForecastSortCol, SortDir } from '../lib/forecast-sort'
import { forecastIdentityDefaultVisible } from '../lib/forecast-identity-cols'
import { FORECAST_CHECKBOX_COL_W, FORECAST_SUBPEP_COL_W, forecastNameStickyLeft, forecastSubPepStickyLeft } from '../lib/forecast-checkbox-col'
import { ForecastIdentityHeaderCells } from './forecast-identity-header-cells'
import { ForecastN7TailExtraHeaderCells } from './forecast-n7-tail-extra'
import { ForecastN4AccionesHeaderCell } from './forecast-n4-acciones'
import { TriCheckbox } from './tri-checkbox'

const thGroup = 'p-[6px_8px] text-center text-[10.5px] font-bold whitespace-nowrap border-b border-border'
const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'

interface ForecastTableHeaderProps {
  cutoff: number
  identityLabel: string
  variant: 'n4' | 'n7'
  sortCol: ForecastSortCol
  sortDir: SortDir
  onSort: (col: string) => void
  /** M7: checkbox "seleccionar todo" de la barra de acciones masivas — se dibuja junto al nombre en
   * vez de agregar una columna nueva, para no tocar los colSpan de identidad/totales de esta cabecera. */
  seleccionTodo?: { checked: boolean; indeterminate: boolean; onToggle: () => void }
  /** Columnas de identidad visibles (botón "Columnas") — todas por defecto en pantallas que todavía no
   * lo ofrecen. */
  visibleCols?: string[]
  /** F: columna fija "SubPEP" antes del nombre — solo aplica a variant 'n7' (ver ForecastN7FlatTable). */
  showSubPepCol?: boolean
}

interface SortableProps {
  col: string
  label: string
  align?: 'left' | 'right' | 'center'
  bordL?: boolean
  bg?: string
  sticky?: boolean
  stickyLeft?: string
  sortCol: ForecastSortCol
  sortDir: SortDir
  onSort: (col: string) => void
}

const ALIGN_TH: Record<NonNullable<SortableProps['align']>, string> = { left: 'min-w-[170px]', right: 'text-right', center: 'text-center' }
const ALIGN_BTN: Record<NonNullable<SortableProps['align']>, string> = { left: 'justify-start', right: 'flex-row-reverse', center: 'justify-center' }

function Sortable({ col, label, align = 'right', bordL, bg, sticky, stickyLeft, sortCol, sortDir, onSort }: SortableProps) {
  const active = sortCol === col
  return (
    <th className={cn(th, bg, bordL && 'border-l-2 border-l-border', sticky && cn('sticky z-[2]', stickyLeft ?? 'left-0'), ALIGN_TH[align])}>
      <button type="button" onClick={() => onSort(col)} className={cn('inline-flex items-center gap-1 normal-case', ALIGN_BTN[align], active ? 'text-primary' : 'hover:text-primary')}>
        {label}
        <Icon name={active && sortDir === 'asc' ? 'chevron_up' : 'chevron_down'} size={10} color="currentColor" />
      </button>
    </th>
  )
}

/** Cabecera compartida por las tablas N4 y N7 de edición de Forecast — identidad copiada de
 * ForecastN4Historico/N7Historico (F) entre el nombre del servicio y los meses; los totales de cierre
 * (A7) usan la misma nomenclatura y estructura de dos bloques que Reales: "Acumulado" (meses cerrados,
 * contra el plan) y "Proyección Anual" (año completo, contra el plan) — ver RealesTableHeader y
 * shared/lib/resumen-blocks.ts, ninguno de los dos es ordenable. F: "el orden con chevron solo debe
 * llegar hasta antes del primer mes de reales" — Nombre y las columnas de identidad son ordenables;
 * meses, Acumulado/Proyección Anual y los extra de N7 no lo son. */
export function ForecastTableHeader({ cutoff, identityLabel, variant, sortCol, sortDir, onSort, seleccionTodo, visibleCols, showSubPepCol }: ForecastTableHeaderProps) {
  const p = { sortCol, sortDir, onSort }
  const identityColCount = (visibleCols ?? forecastIdentityDefaultVisible(variant)).length
  const tailExtraCount = variant === 'n7' ? 4 : 1
  const showSubPep = variant === 'n7' && !!showSubPepCol
  const hasCheckbox = !!seleccionTodo

  return (
    <thead>
      <tr>
        {hasCheckbox && <th className={cn(th, FORECAST_CHECKBOX_COL_W, 'sticky left-0 z-[2]')} />}
        {showSubPep && <th className={cn(th, FORECAST_SUBPEP_COL_W, 'sticky z-[2]', forecastSubPepStickyLeft(hasCheckbox))} />}
        <th className={cn(th, 'sticky z-[2]', forecastNameStickyLeft(hasCheckbox, showSubPep))} />
        {identityColCount > 0 && <th colSpan={identityColCount} className={th} />}
        <th colSpan={cutoff} className={cn(thGroup, 'border-l-2 border-l-[#C4DFFF] bg-[#EEF4FF] text-primary')}>
          Real (YTD) · {monthLabels[0].slice(0, 3)}-{monthLabels[cutoff - 1].slice(0, 3)}
        </th>
        <th colSpan={12 - cutoff} className={cn(thGroup, 'border-l-2 border-l-[#CBD5E1] text-muted-foreground')}>
          Forecast (YTG) · {monthLabels[cutoff].slice(0, 3)}-{monthLabels[11].slice(0, 3)}
        </th>
        <th colSpan={RESUMEN_ACUMULADO_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')}>
          {resumenAcumuladoLabel(cutoff)}
        </th>
        <th colSpan={PROYECCION_ANUAL_COLS.length} className={cn(thGroup, 'border-l-2 border-l-border bg-primary/5 text-primary')}>
          {PROYECCION_ANUAL_LABEL}
        </th>
        {tailExtraCount > 0 && <th colSpan={tailExtraCount} className={cn(thGroup, 'border-l-2 border-l-border text-cs-gris-oscuro')} />}
      </tr>
      <tr>
        {seleccionTodo && (
          <th className={cn(th, FORECAST_CHECKBOX_COL_W, 'sticky left-0 z-[2]')}>
            <TriCheckbox checked={seleccionTodo.checked} indeterminate={seleccionTodo.indeterminate} onChange={seleccionTodo.onToggle} ariaLabel="Seleccionar todo" />
          </th>
        )}
        {showSubPep && <th className={cn(th, FORECAST_SUBPEP_COL_W, 'sticky z-[2]', forecastSubPepStickyLeft(hasCheckbox))}>SubPEP</th>}
        <Sortable col="nombre" label={identityLabel} align="left" sticky stickyLeft={forecastNameStickyLeft(hasCheckbox, showSubPep)} {...p} />
        <ForecastIdentityHeaderCells variant={variant} visibleCols={visibleCols} {...p} />
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
        {RESUMEN_ACUMULADO_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, i === 0 && 'border-l-2 border-l-border', c.key.startsWith('desvioAcumPct') ? 'text-center' : 'text-right')}>
            {c.label}
          </th>
        ))}
        {PROYECCION_ANUAL_COLS.map((c, i) => (
          <th key={c.key} className={cn(th, 'bg-primary/5 text-primary', i === 0 && 'border-l-2 border-l-border', c.key === 'desvioAnualPct' ? 'text-center' : 'text-right')}>
            {c.label}
          </th>
        ))}
        {variant === 'n7' && <ForecastN7TailExtraHeaderCells />}
        {variant === 'n4' && <ForecastN4AccionesHeaderCell />}
      </tr>
    </thead>
  )
}
