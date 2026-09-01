import { useContext } from 'react'
import { ForecastContext } from './forecast-context'

export function useForecastStore() {
  const ctx = useContext(ForecastContext)
  if (!ctx) throw new Error('useForecastStore must be used within ForecastProvider')
  return ctx
}
