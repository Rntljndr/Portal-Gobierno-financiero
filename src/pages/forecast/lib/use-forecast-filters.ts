import { useMemo, useState } from 'react'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import type { ForecastFlatN7Row } from './forecast-flat-n7'
import { EMPTY_FORECAST_FILTERS, type ForecastFilters } from './forecast-filters-types'
import { applyForecastN4Filters, applyForecastN7Filters, buildForecastN4Options, buildForecastN7Options, forecastActiveFilterCount } from './forecast-filters'

/** Filtros de la pantalla principal de Forecast (F: "al igual que en reales") — un solo estado
 * compartido por los tabs N4/N7, aplicado sobre las filas ya visibles de cada tabla (después de
 * ocultar-en-cero). */
export function useForecastFilters(tab: 'n4' | 'n7', n4Rows: ForecastN4Linea[], n7Rows: ForecastFlatN7Row[], cutoff: number) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<ForecastFilters>(EMPTY_FORECAST_FILTERS)

  const onChange = <K extends keyof ForecastFilters>(key: K, value: ForecastFilters[K]) => setFilters((f) => ({ ...f, [key]: value }))
  const clear = () => setFilters(EMPTY_FORECAST_FILTERS)
  const activeCount = forecastActiveFilterCount(filters)

  const options = useMemo(() => (tab === 'n4' ? buildForecastN4Options(n4Rows) : buildForecastN7Options(n7Rows, cutoff)), [tab, n4Rows, n7Rows, cutoff])
  const filteredN4 = useMemo(() => applyForecastN4Filters(n4Rows, filters), [n4Rows, filters])
  const filteredN7 = useMemo(() => applyForecastN7Filters(n7Rows, filters, cutoff), [n7Rows, filters, cutoff])

  return { open, setOpen, filters, onChange, clear, activeCount, options, filteredN4, filteredN7 }
}
