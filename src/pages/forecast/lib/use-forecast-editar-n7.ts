import { useState } from 'react'
import { useToast } from '@/shared/lib/use-toast'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import type { ForecastFlatN7Row } from './forecast-flat-n7'
import { useForecastStore } from './use-forecast-store'
import { useForecastFilters } from './use-forecast-filters'
import { calcN7Totals } from './forecast-edit-calc'
import { estaEnCero } from './hide-zero-lines'

/** Estado de la lista de PEP N7 de un servicio N4 (A5: la edición de cada PEP N7 vive en el drawer
 * ForecastN7EditarDrawer, no acá — este hook solo resuelve el listado y "Restablecer llave"). F:
 * "agregar el botón de filtros N7" — mismos filtros/UI que el tab "Forecast N7" de la pantalla
 * principal (useForecastFilters), acá siempre en modo 'n7' y acotado a los PEP N7 de este N4. */
export function useForecastEditarN7(roundId: string | undefined, n4Codigo: string | undefined) {
  const { rounds, resetLlaveN7 } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)
  const n4 = round?.lineas.find((l) => l.n4Codigo === n4Codigo)
  const { message, showToast } = useToast()

  const [ocultarCeros, setOcultarCeros] = useState(true)

  const onResetLlave = (n7Codigo: string) => {
    if (!round || !n4) return
    resetLlaveN7(round.id, n4.n4Codigo, n7Codigo)
    showToast('Llave de distribución restablecida para este PEP N7.')
  }

  const n7s = n4?.n7 ?? []
  const n7SinCeros = n4 ? (ocultarCeros ? n7s.filter((n7) => !estaEnCero(calcN7Totals(n4.n4Codigo, n7, FORECAST_MES_ACTUAL))) : n7s) : []
  const flatRows: ForecastFlatN7Row[] = n4 ? n7SinCeros.map((n7) => ({ n4Codigo: n4.n4Codigo, n4Nombre: n4.n4Nombre, n7, n4Siblings: n4.n7, n4Notas: n4.notas })) : []
  const filtros = useForecastFilters('n7', [], flatRows, FORECAST_MES_ACTUAL)
  const n7Visibles = filtros.filteredN7.map((r) => r.n7)

  return { round, n4, n7Visibles, ocultarCeros, setOcultarCeros, cutoff: FORECAST_MES_ACTUAL, message, onResetLlave, filtros }
}
