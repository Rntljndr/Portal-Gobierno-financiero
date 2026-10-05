import { useMemo } from 'react'
import { useForecastStore } from './use-forecast-store'
import { useForecastEditarN4 } from './use-forecast-editar-n4'
import { useForecastCargaMasiva } from './use-forecast-carga-masiva'
import { buildFlatN7Rows } from './forecast-flat-n7'
import { calcN7Totals } from './forecast-edit-calc'
import { estaEnCero } from './hide-zero-lines'
import { useForecastFilters } from './use-forecast-filters'

/** Datos y hooks de ForecastDetailPage (F: "misma estructura que el forecast") — extraído para
 * mantener la página bajo el límite de líneas del linter. `activo` es el propio `round` cuando sigue
 * Abierto (llegar acá vía "Volver al Forecast" desde las pantallas de edición), o `undefined` cuando
 * está Cerrado (F: un forecast anterior nunca es editable, sin importar cómo se llegó a `/forecast/:id`). */
export function useForecastDetail(id: string | undefined, tab: 'n4' | 'n7') {
  const { rounds, closeRound, comparativa, setComparativa } = useForecastStore()
  const round = rounds.find((r) => r.id === id)
  const activo = round?.estado === 'Abierto' ? round : undefined
  // F: forecast activo real del sistema, distinto de `activo` de arriba (que es `undefined` si el
  // round que se está viendo está Cerrado) — para mostrar su card con botón "Ir" al ver un anterior.
  const activoReal = rounds.find((r) => r.estado === 'Abierto')
  const anteriores = rounds.filter((r) => r.estado === 'Cerrado').sort((a, b) => (a.fechaTermino < b.fechaTermino ? 1 : -1))
  const anteriorRoundComparativa = rounds.find((r) => r.id === comparativa.forecastRoundId)

  const tabla = useForecastEditarN4(round?.id)
  const cm = useForecastCargaMasiva(activo)

  const flatN7Rows = useMemo(() => {
    const rows = buildFlatN7Rows(round?.lineas ?? [])
    return tabla.ocultarCeros ? rows.filter((r) => !estaEnCero(calcN7Totals(r.n4Codigo, r.n7, tabla.cutoff))) : rows
  }, [round, tabla.ocultarCeros, tabla.cutoff])

  const filtros = useForecastFilters(tab, tabla.lineasVisibles, flatN7Rows, tabla.cutoff)

  return { rounds, closeRound, comparativa, setComparativa, round, activo, activoReal, anteriores, anteriorRoundComparativa, tabla, cm, filtros }
}
