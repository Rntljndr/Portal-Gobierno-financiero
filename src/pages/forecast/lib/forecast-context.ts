import { createContext } from 'react'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastMesNota } from '@/data/forecast-lineas'
import type { ForecastEnvioTransicion } from './forecast-envio'
import type { ForecastTablaComparativa } from './forecast-tabla-comparativa'

export interface ForecastStore {
  rounds: ForecastRound[]
  /** Comparativa de tabla (botón "Comparar") — vive acá, no en cada pantalla, para que la selección
   * persista al navegar entre el listado (N4/N7) y el detalle de un servicio (F: "debe permanecer en
   * todas las vistas donde existe el campo de comparación"). También alimenta la serie "anterior" del
   * gráfico de ForecastN7EditarContent — una sola selección para toda la sesión. */
  comparativa: ForecastTablaComparativa
  setComparativa: (next: ForecastTablaComparativa) => void
  addRound: (round: ForecastRound) => void
  closeRound: (id: string) => void
  deleteRound: (id: string) => void
  updateN4Monto: (roundId: string, n4Codigo: string, monthKey: string, monto: number, nota?: ForecastMesNota) => void
  updateN7Monto: (roundId: string, n4Codigo: string, n7Codigo: string, monthKey: string, monto: number, nota?: ForecastMesNota) => void
  resetLlaveN7: (roundId: string, n4Codigo: string, n7Codigo: string) => void
  /** Aplica varios meses de varias líneas N7 en una sola actualización (carga masiva o edición
   * conjunta de meses restantes — ver ForecastN7DetallePage) — evita N llamadas a updateN7Monto (una
   * por celda), que dispararían N re-renders. Marca cada línea tocada como manual, igual que
   * updateN7Monto. `notas`, si viene, se aplica a cada monthKey editado de esa línea. */
  updateN7MesesBatch: (roundId: string, updates: { n4Codigo: string; n7Codigo: string; meses: Record<string, number>; notas?: ForecastMesNota }[]) => void
  /** Edita los campos de "Datos del Forecast" (drawer de detalle del Activo) — solo Control de Gestión. */
  updateRoundDatos: (
    roundId: string,
    patch: Partial<Pick<ForecastRound, 'titulo' | 'descripcion' | 'fechaInicio' | 'fechaTermino' | 'horaInicio' | 'horaTermino' | 'desvio' | 'tipo' | 'notificar'>>,
  ) => void
  /** Edita una celda de la tabla de tasas de cambio (mismo contrato que TasasCambioTable#onChange). */
  updateTasaCambio: (roundId: string, moneda: string, mesIndex: number, valor: string) => void
  /** Aplica una transición de estado (M7: enviar/aprobar/rechazar) sobre varias líneas seleccionadas a
   * la vez — `seleccion` son claves de n4Codigo (si FORECAST_ENVIO_NIVEL es 'n4') o de forecastN7Key
   * (si es 'n7'), según arme la selección cada tabla. */
  aplicarTransicionCdG: (roundId: string, transicion: ForecastEnvioTransicion, seleccion: Set<string>) => void
}

export const ForecastContext = createContext<ForecastStore | null>(null)
