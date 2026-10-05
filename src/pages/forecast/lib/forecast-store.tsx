import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { forecastRoundsIniciales, FORECAST_MES_ACTUAL, type ForecastRound } from '@/data/forecast'
import type { ForecastMesNota } from '@/data/forecast-lineas'
import { ForecastContext, type ForecastStore } from './forecast-context'
import { distribuirMontoN4Completo, restablecerLlaveN7 } from './forecast-llave'
import { aplicarCierreRound, aplicarTransicionCdGBulk } from './forecast-envio'
import { aplicarN7MesesBatch } from './forecast-batch-update'
import { EMPTY_TABLA_COMPARATIVA, type ForecastTablaComparativa } from './forecast-tabla-comparativa'

/** Fábrica de las acciones del store, separada del componente para mantener ForecastProvider bajo el
 * límite de líneas del linter — todas cierran sobre el mismo `setRounds`. */
function createForecastActions(
  setRounds: Dispatch<SetStateAction<ForecastRound[]>>,
  setComparativa: Dispatch<SetStateAction<ForecastTablaComparativa>>,
): Omit<ForecastStore, 'rounds' | 'comparativa'> {
  return {
    // A2: abrir un forecast nuevo no cierra el anterior — "Nuevo Forecast" ya queda deshabilitado
    // mientras haya uno Abierto (forecast-list-header-actions.tsx).
    addRound: (round) => setRounds((prev) => [round, ...prev]),
    closeRound: (id) => setRounds((prev) => prev.map((r) => (r.id === id ? aplicarCierreRound(r) : r))),
    deleteRound: (id) => setRounds((prev) => prev.filter((r) => r.id !== id)),

    updateN4Monto: (roundId, n4Codigo, monthKey, monto, nota) =>
      setRounds((prev) =>
        prev.map((r) => {
          if (r.id !== roundId) return r
          const lineas = r.lineas.map((n4) => {
            if (n4.n4Codigo !== n4Codigo || n4.n7.length === 0) return n4
            const n7 = distribuirMontoN4Completo(n4, monthKey, monto, FORECAST_MES_ACTUAL)
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
      setRounds((prev) => prev.map((r) => (r.id === roundId ? { ...r, lineas: aplicarN7MesesBatch(r.lineas, updates) } : r))),

    updateRoundDatos: (roundId, patch) => setRounds((prev) => prev.map((r) => (r.id === roundId ? { ...r, ...patch } : r))),

    updateTasaCambio: (roundId, moneda, mesIndex, valor) =>
      setRounds((prev) =>
        prev.map((r) => {
          if (r.id !== roundId) return r
          const serie = [...(r.tasasCambio[moneda] ?? [])]
          serie[mesIndex] = valor
          return { ...r, tasasCambio: { ...r.tasasCambio, [moneda]: serie } }
        }),
      ),

    aplicarTransicionCdG: (roundId, transicion, seleccion) =>
      setRounds((prev) => prev.map((r) => (r.id === roundId ? { ...r, lineas: aplicarTransicionCdGBulk(r.lineas, transicion, seleccion) } : r))),
    setComparativa,
  }
}

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [rounds, setRounds] = useState<ForecastRound[]>(forecastRoundsIniciales)
  // Comparativa de tabla (botón "Comparar") — a nivel de store para que persista al navegar entre
  // pantallas (F: "debe permanecer en todas las vistas donde existe el campo de comparación").
  const [comparativa, setComparativa] = useState<ForecastTablaComparativa>(EMPTY_TABLA_COMPARATIVA)
  const store: ForecastStore = { rounds, comparativa, ...createForecastActions(setRounds, setComparativa) }
  return <ForecastContext.Provider value={store}>{children}</ForecastContext.Provider>
}
