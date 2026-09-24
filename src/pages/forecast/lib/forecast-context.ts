import { createContext } from 'react'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastMesNota } from '@/data/forecast-lineas'

export interface ForecastStore {
  rounds: ForecastRound[]
  addRound: (round: ForecastRound) => void
  closeRound: (id: string) => void
  deleteRound: (id: string) => void
  updateN4Monto: (roundId: string, n4Codigo: string, monthKey: string, monto: number, nota?: ForecastMesNota) => void
  updateN7Monto: (roundId: string, n4Codigo: string, n7Codigo: string, monthKey: string, monto: number, nota?: ForecastMesNota) => void
  resetLlaveN7: (roundId: string, n4Codigo: string, n7Codigo: string) => void
  /** Aplica varios meses de varias líneas N7 en una sola actualización (carga masiva) — evita N
   * llamadas a updateN7Monto (una por celda), que dispararían N re-renders. Marca cada línea tocada
   * como manual, igual que updateN7Monto. */
  updateN7MesesBatch: (roundId: string, updates: { n4Codigo: string; n7Codigo: string; meses: Record<string, number> }[]) => void
}

export const ForecastContext = createContext<ForecastStore | null>(null)
