import { useState } from 'react'
import { FORECAST_MES_ACTUAL } from '@/data/forecast'
import { calcN4Totals } from './forecast-edit-calc'
import { estaEnCero } from './hide-zero-lines'
import { useForecastStore } from './use-forecast-store'

export function useForecastEditarN4(roundId: string | undefined) {
  const { rounds } = useForecastStore()
  const round = rounds.find((r) => r.id === roundId)

  const [ocultarCeros, setOcultarCeros] = useState(true)

  const lineas = round?.lineas ?? []
  const lineasVisibles = ocultarCeros ? lineas.filter((n4) => !estaEnCero(calcN4Totals(n4, FORECAST_MES_ACTUAL))) : lineas

  return {
    round,
    lineasVisibles,
    ocultarCeros,
    setOcultarCeros,
    cutoff: FORECAST_MES_ACTUAL,
  }
}
