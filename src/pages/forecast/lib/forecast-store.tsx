import { useState, type ReactNode } from 'react'
import { forecastRoundsIniciales, FORECAST_MES_ACTUAL, type ForecastRound } from '@/data/forecast'
import type { ForecastMesNota } from '@/data/forecast-lineas'
import { ForecastContext, type ForecastStore } from './forecast-context'
import { distribuirMontoN4, restablecerLlaveN7 } from './forecast-llave'

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [rounds, setRounds] = useState<ForecastRound[]>(forecastRoundsIniciales)

  const store: ForecastStore = {
    rounds,
    addRound: (round) => setRounds((prev) => [round, ...prev.map((r) => (r.estado === 'Abierto' ? { ...r, estado: 'Cerrado' as const } : r))]),
    closeRound: (id) => setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, estado: 'Cerrado' as const, cerradoManual: true } : r))),
    deleteRound: (id) => setRounds((prev) => prev.filter((r) => r.id !== id)),

    updateN4Monto: (roundId, n4Codigo, monthKey, monto, nota) =>
      setRounds((prev) =>
        prev.map((r) => {
          if (r.id !== roundId) return r
          const lineas = r.lineas.map((n4) => {
            if (n4.n4Codigo !== n4Codigo) return n4
            const sinAutomaticos = n4.n7.length > 0 && n4.n7.every((l) => l.tipoActualizacion === 'manual')
            if (sinAutomaticos) return n4
            const n7 = distribuirMontoN4(n4, monthKey, monto, FORECAST_MES_ACTUAL)
            const notas: Record<string, ForecastMesNota> = nota ? { ...n4.notas, [monthKey]: nota } : n4.notas
            return { ...n4, n7, notas }
          })
          return { ...r, lineas }
        }),
      ),

    updateN7Monto: (roundId, n4Codigo, n7Codigo, monthKey, monto, nota) =>
      setRounds((prev) =>
        prev.map((r) => {
          if (r.id !== roundId) return r
          const lineas = r.lineas.map((n4) => {
            if (n4.n4Codigo !== n4Codigo) return n4
            const n7 = n4.n7.map((line) => {
              if (line.n7Codigo !== n7Codigo) return line
              const notas: Record<string, ForecastMesNota> = nota ? { ...line.notas, [monthKey]: nota } : line.notas
              return { ...line, meses: { ...line.meses, [monthKey]: monto }, tipoActualizacion: 'manual' as const, notas }
            })
            return { ...n4, n7 }
          })
          return { ...r, lineas }
        }),
      ),

    resetLlaveN7: (roundId, n4Codigo, n7Codigo) =>
      setRounds((prev) =>
        prev.map((r) => {
          if (r.id !== roundId) return r
          const lineas = r.lineas.map((n4) => (n4.n4Codigo === n4Codigo ? restablecerLlaveN7(n4, n7Codigo, FORECAST_MES_ACTUAL) : n4))
          return { ...r, lineas }
        }),
      ),

    updateN7MesesBatch: (roundId, updates) =>
      setRounds((prev) => {
        const byN7Codigo = new Map(updates.map((u) => [u.n7Codigo, u]))
        return prev.map((r) => {
          if (r.id !== roundId) return r
          const lineas = r.lineas.map((n4) => ({
            ...n4,
            n7: n4.n7.map((line) => {
              const update = byN7Codigo.get(line.n7Codigo)
              return update && update.n4Codigo === n4.n4Codigo ? { ...line, meses: { ...line.meses, ...update.meses }, tipoActualizacion: 'manual' as const } : line
            }),
          }))
          return { ...r, lineas }
        })
      }),
  }

  return <ForecastContext.Provider value={store}>{children}</ForecastContext.Provider>
}
