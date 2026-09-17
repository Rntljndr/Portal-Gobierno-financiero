import type { Servicio } from './types'

/** Las 4 categorías reales del tablero de Control de Gestión (confirmadas por inspección directa de la herramienta ad hoc). */
export const origenServicioOptions = ['Nuevo Servicio', 'Post Implementación', 'Recurrente', 'Sin origen informado'] as const
export type OrigenServicio = (typeof origenServicioOptions)[number]

/**
 * Regla PROVISORIA: SIP no tiene hoy un campo que registre esta categoría 1 a 1 por servicio.
 * Se aproxima con lo disponible — tipoOrigen "Recurrente" mapea directo; dentro de "Nuevo" se separa
 * por rubro (rubro "Servicios" → Nuevo Servicio, resto → Post Implementación). Ningún servicio del
 * mock queda "Sin origen informado" porque el fixture siempre completa tipoOrigen y rubro.
 * Pendiente de confirmar con Control de Gestión la regla real.
 */
export function origenServicioDe(s: Servicio): OrigenServicio {
  if (s.tipoOrigen === 'Recurrente') return 'Recurrente'
  return s.rubro === 'Servicios' ? 'Nuevo Servicio' : 'Post Implementación'
}
