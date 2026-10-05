import { useMemo, useState } from 'react'
import type { ForecastN4Linea } from '@/data/forecast-lineas'
import { forecastN7Key } from './forecast-envio'
import type { ForecastFlatN7Row } from './forecast-flat-n7'
import type { useForecastFilters } from './use-forecast-filters'

/** Selección múltiple de líneas (M7) — mismo patrón que usePrelimToolbar en Preliminares (un Set de
 * claves + helpers de toggle/selectAll), reimplementado localmente porque pages/<A> nunca importa de
 * pages/<B>. `seleccionables` son las claves de las filas que sí pueden elegirse ahora mismo (no las
 * que ya están en un estado terminal o en un forecast de solo lectura); una clave elegida que deje de
 * ser seleccionable (por un cambio de filtro, por ejemplo) simplemente se ignora sin necesidad de
 * limpiarla del Set. */
export function useForecastSeleccion(seleccionables: string[]) {
  const [seleccionCruda, setSeleccionCruda] = useState<Set<string>>(new Set())

  const seleccionablesSet = useMemo(() => new Set(seleccionables), [seleccionables])
  const seleccion = useMemo(() => new Set([...seleccionCruda].filter((k) => seleccionablesSet.has(k))), [seleccionCruda, seleccionablesSet])

  const toggle = (key: string) =>
    setSeleccionCruda((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const allSelected = seleccionables.length > 0 && seleccion.size === seleccionables.length
  const indeterminate = seleccion.size > 0 && !allSelected
  const toggleAll = () => setSeleccionCruda(allSelected ? new Set() : new Set(seleccionables))
  const clear = () => setSeleccionCruda(new Set())

  return { seleccion, toggle, allSelected, indeterminate, toggleAll, clear }
}

/** Filas que todavía pueden pasar por alguna transición de la barra de acciones masivas (M7) — las que
 * ya quedaron "Validado por Control de Gestión" son terminales, igual que "definitivo" en Preliminares. */
function seleccionablesN4(rows: ForecastN4Linea[]): string[] {
  return rows.filter((n4) => n4.envioEstado !== 'Validado por Control de Gestión').map((n4) => n4.n4Codigo)
}

function seleccionablesN7(rows: ForecastFlatN7Row[]): string[] {
  return rows.filter((r) => r.n7.envioEstado !== 'Validado por Control de Gestión').map((r) => forecastN7Key(r.n4Codigo, r.n7.n7Codigo))
}

/** Arma la selección múltiple de la tabla activa de ForecastListBody (M7) — F: "Forecast N7 debe tener
 * la misma funcionalidad de seleccionar todo que Forecast N4", así que ambos tabs la ofrecen por igual
 * (no depende de FORECAST_ENVIO_NIVEL: el envío masivo ya reconoce claves de N4 y de N7 en el mismo Set,
 * ver aplicarTransicionCdGBulk). Extraído para mantener ForecastListBody bajo el límite de líneas del
 * linter. */
export function useForecastListSeleccion(tab: 'n4' | 'n7', readOnly: boolean, filtros: ReturnType<typeof useForecastFilters>) {
  const seleccionN4 = useForecastSeleccion(!readOnly && tab === 'n4' ? seleccionablesN4(filtros.filteredN4) : [])
  const seleccionN7 = useForecastSeleccion(!readOnly && tab === 'n7' ? seleccionablesN7(filtros.filteredN7) : [])
  const mostrarSeleccionN4 = !readOnly && tab === 'n4'
  const mostrarSeleccionN7 = !readOnly && tab === 'n7'
  const seleccionActiva = tab === 'n4' ? seleccionN4 : seleccionN7

  return { seleccionN4, seleccionN7, mostrarSeleccionN4, mostrarSeleccionN7, seleccionActiva }
}
