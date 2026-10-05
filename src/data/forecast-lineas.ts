import { monthKeys, pepN4Tablon } from './reporteria'
import type { PepN7Row } from './reporteria'

export type ForecastTipoActualizacion = 'automatica' | 'manual'

/** Estado de envío a Control de Gestión (C11) — a qué nivel (N4 o N7) se aplica depende de
 * FORECAST_ENVIO_NIVEL (forecast-config.ts); el campo existe en ambos niveles para no atarlo a uno.
 * "Validado por Control de Gestión" es el estado final que deja el cierre del forecast (A3), igual
 * que en Reales. "Rechazado" (M7) vuelve a poder enviarse — no es terminal. */
export type ForecastEnvioEstado = 'Abierto' | 'Enviado a CG' | 'Validado por Control de Gestión' | 'Rechazado'

export interface ForecastMesNota {
  justificacion?: string
  comentario?: string
}

/** Estado de un evento del historial del PEP (F: "el tag dice enviado... el tag menciona que requiere
 * revisión") — registro de auditoría de cada acción relevante sobre el PEP N7, más granular que
 * ForecastEnvioEstado (que solo maneja el flujo formal enviar/aprobar/rechazar a Control de Gestión):
 * acá también queda registrada la edición manual, que no tiene un ForecastEnvioEstado propio. */
export type ForecastHistorialEstado = 'Enviado' | 'Requiere revisión' | 'Aprobado' | 'Rechazado'

export interface ForecastHistorialEntry {
  estado: ForecastHistorialEstado
  /** Ya formateada para mostrar (ver forecast-historial.ts#formatFechaHistorial) — no hace falta volver a calcular el formato al renderizar. */
  fecha: string
  /** Ausente = evento automático (p. ej. la apertura del forecast). */
  autor?: string
  /** Comentario o justificación asociada a este evento, si la hubo. */
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
  envioEstado: ForecastEnvioEstado
  /** F: "cuando un usuario escribe un comentario y justificación esta se debe ver reflejado en un tag
   * seleccionable" — en orden cronológico (más antiguo primero); ver forecast-historial.ts para cómo se
   * arma la vista completa (incluye un evento base "Enviado" automático que no vive acá, derivado de la
   * fecha de apertura del round). */
  historial: ForecastHistorialEntry[]
}

export interface ForecastN4Linea {
  n4Codigo: string
  n4Nombre: string
  pais: string
  equipo: string
  n7: ForecastN7Linea[]
  notas: Record<string, ForecastMesNota>
  envioEstado: ForecastEnvioEstado
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
  return { n7Codigo: n7.codigo, n7Nombre: n7.nombre, meses, tipoActualizacion: 'automatica', notas: {}, envioEstado: 'Abierto', historial: [] }
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
    envioEstado: 'Abierto',
  }))
}
