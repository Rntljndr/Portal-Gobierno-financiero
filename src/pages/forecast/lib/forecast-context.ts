import { createContext } from 'react'
import type { ForecastRound } from '@/data/forecast'

export interface ForecastStore {
  rounds: ForecastRound[]
  addRound: (round: ForecastRound) => void
  closeRound: (id: string) => void
  deleteRound: (id: string) => void
}

export const ForecastContext = createContext<ForecastStore | null>(null)
