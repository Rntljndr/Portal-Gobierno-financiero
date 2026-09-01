import { Outlet } from 'react-router'
import { ForecastProvider } from './lib/forecast-store'

export function ForecastLayout() {
  return (
    <ForecastProvider>
      <Outlet />
    </ForecastProvider>
  )
}
