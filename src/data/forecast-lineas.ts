import { monthKeys, pepN4Tablon } from './reporteria'
import type { PepN7Row } from './reporteria'

export type ForecastTipoActualizacion = 'automatica' | 'manual'

export interface ForecastMesNota {
  justificacion?: string
  comentario?: string
}

export interface ForecastN7Linea {
  n7Codigo: string
  n7Nombre: string
  /** 12 keys (monthKeys), monto ya con factor aplicado. */
  meses: Record<string, number>
  tipoActualizacion: ForecastTipoActualizacion
  /** key = monthKey editado. */
  notas: Record<string, ForecastMesNota>
}

export interface ForecastN4Linea {
  n4Codigo: string
  n4Nombre: string
  pais: string
  equipo: string
  n7: ForecastN7Linea[]
  notas: Record<string, ForecastMesNota>
}

/** Factor de proyección inicial para meses aún sin Real: mismo criterio que la serie de comparación "Forecast" de Reales (reales-calc.ts). */
const FORECAST_FACTOR_INICIAL = 0.97

function buildN7Linea(n7: PepN7Row, cutoff: number): ForecastN7Linea {
  const meses: Record<string, number> = {}
  monthKeys.forEach((k, i) => {
    const base = n7.meses[k] || 0
    const factor = i < cutoff ? n7.planFactor : FORECAST_FACTOR_INICIAL
    meses[k] = Math.round(base * factor)
  })
  return { n7Codigo: n7.codigo, n7Nombre: n7.nombre, meses, tipoActualizacion: 'automatica', notas: {} }
}

/** Semilla de líneas de un forecast: todos los N4 (tipo global, selPeps vacío) o solo los seleccionados (tipo parcial). */
export function buildInitialLineas(selPeps: string[], cutoff: number): ForecastN4Linea[] {
  const set = new Set(selPeps)
  const n4s = selPeps.length === 0 ? pepN4Tablon : pepN4Tablon.filter((n4) => set.has(n4.codigo))
  return n4s.map((n4) => ({
    n4Codigo: n4.codigo,
    n4Nombre: n4.nombre,
    pais: n4.pais,
    equipo: n4.equipo,
    n7: n4.children.map((n7) => buildN7Linea(n7, cutoff)),
    notas: {},
  }))
}
