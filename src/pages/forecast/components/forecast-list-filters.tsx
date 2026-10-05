import type { ForecastRound } from '@/data/forecast'
import type { useForecastFilters } from '../lib/use-forecast-filters'
import { ForecastFilterToggle, ForecastFiltersPanel } from './forecast-filters'

interface ForecastListFiltersProps {
  roundMostrado: ForecastRound | undefined
  isN7: boolean
  filtros: ReturnType<typeof useForecastFilters>
}

/** Toggle + panel de filtros de la pantalla principal de Forecast — extraído aparte para mantener
 * ForecastListBody bajo el límite de líneas del linter. */
export function ForecastListFilters({ roundMostrado, isN7, filtros }: ForecastListFiltersProps) {
  return (
    <>
      {roundMostrado && (
        <div className="mx-8 mb-3">
          <ForecastFilterToggle open={filtros.open} onToggle={() => filtros.setOpen((v) => !v)} activeCount={filtros.activeCount} />
        </div>
      )}
      <ForecastFiltersPanel
        open={filtros.open}
        isN7={isN7}
        filters={filtros.filters}
        options={filtros.options}
        onChange={filtros.onChange}
        onClear={filtros.clear}
        activeCount={filtros.activeCount}
      />
    </>
  )
}
