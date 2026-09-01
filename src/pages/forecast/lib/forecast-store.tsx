import { useState, type ReactNode } from 'react'
import { forecastRoundsIniciales, type ForecastRound } from '@/data/forecast'
import { ForecastContext, type ForecastStore } from './forecast-context'

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [rounds, setRounds] = useState<ForecastRound[]>(forecastRoundsIniciales)

  const store: ForecastStore = {
    rounds,
    addRound: (round) => setRounds((prev) => [round, ...prev.map((r) => (r.estado === 'Abierto' ? { ...r, estado: 'Cerrado' as const } : r))]),
    closeRound: (id) => setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, estado: 'Cerrado' as const, cerradoManual: true } : r))),
    deleteRound: (id) => setRounds((prev) => prev.filter((r) => r.id !== id)),
  }

  return <ForecastContext.Provider value={store}>{children}</ForecastContext.Provider>
}
