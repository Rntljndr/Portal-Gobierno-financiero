import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui'
import { FORECAST_IDENTITY_COLS, forecastIdentityDefaultVisible } from '../lib/forecast-identity-cols'
import type { ForecastSortCol, SortDir } from '../lib/forecast-sort'

const th = 'p-[9px_8px] text-left text-[10.5px] font-bold tracking-[0.04em] text-muted-foreground uppercase whitespace-nowrap border-b-2 border-border bg-[#F4F6FB]'
/** Completitud/Estado van centradas (mismo criterio que la columna "Completitud"/"Estado" de Preliminares). */
const CENTERED_COLS = new Set(['completitud', 'estado'])

interface ForecastIdentityHeaderCellsProps {
  variant: 'n4' | 'n7'
  /** Columnas visibles (botón "Columnas") — todas por defecto en pantallas que todavía no lo ofrecen. */
  visibleCols?: string[]
  sortCol: ForecastSortCol
  sortDir: SortDir
  onSort: (col: string) => void
}

/** Columnas de identidad copiadas de ForecastN4Historico/ForecastN7Historico (F) — van entre el nombre
 * del servicio (ya existente, ordenable) y los meses. F: "sumar en cada columna un chevron para
 * ordenar" — cada una ordena por su propio valor (forecastIdentitySortValue). */
export function ForecastIdentityHeaderCells({ variant, visibleCols, sortCol, sortDir, onSort }: ForecastIdentityHeaderCellsProps) {
  const cols = FORECAST_IDENTITY_COLS[variant].filter((c) => (visibleCols ?? forecastIdentityDefaultVisible(variant)).includes(c.key))
  const centered = (key: string) => CENTERED_COLS.has(key)

  return (
    <>
      {cols.map((c) => {
        const active = sortCol === c.key
        return (
          <th key={c.key} className={cn(th, centered(c.key) && 'text-center')}>
            <button
              type="button"
              onClick={() => onSort(c.key)}
              className={cn('inline-flex items-center gap-1 normal-case', centered(c.key) && 'justify-center', active ? 'text-primary' : 'hover:text-primary')}
            >
              {c.label}
              <Icon name={active && sortDir === 'asc' ? 'chevron_up' : 'chevron_down'} size={10} color="currentColor" />
            </button>
          </th>
        )
      })}
    </>
  )
}
