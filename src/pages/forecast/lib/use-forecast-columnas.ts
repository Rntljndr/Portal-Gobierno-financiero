import { useState } from 'react'
import { forecastIdentityDefaultVisible } from './forecast-identity-cols'

/** Columnas de identidad visibles (botón "Columnas") de la tabla activa de ForecastListBody — una
 * lista por nivel (N4/N7), igual que useForecastListSeleccion/useForecastListColapso, para que cambiar
 * de tab no pierda la elección hecha en el otro. */
export function useForecastListColumnas(tab: 'n4' | 'n7') {
  const [visibleColsN4, setVisibleColsN4] = useState<string[]>(() => forecastIdentityDefaultVisible('n4'))
  const [visibleColsN7, setVisibleColsN7] = useState<string[]>(() => forecastIdentityDefaultVisible('n7'))
  const visibleCols = tab === 'n4' ? visibleColsN4 : visibleColsN7
  const setVisibleCols = tab === 'n4' ? setVisibleColsN4 : setVisibleColsN7

  return { visibleColsN4, visibleColsN7, visibleCols, setVisibleCols }
}
