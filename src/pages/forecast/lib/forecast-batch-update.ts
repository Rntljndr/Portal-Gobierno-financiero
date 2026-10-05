import type { ForecastMesNota, ForecastN4Linea } from '@/data/forecast-lineas'
import { forecastHistorialEntry } from './forecast-historial'

export interface ForecastN7MesesBatchUpdate {
  n4Codigo: string
  n7Codigo: string
  meses: Record<string, number>
  notas?: ForecastMesNota
}

/** Aplica varios meses de varias líneas N7 en una sola pasada (carga masiva o edición conjunta de
 * meses restantes — ver ForecastN7DetallePage) — extraído de forecast-store.tsx para mantener
 * ForecastProvider bajo el límite de líneas del linter. F: cada aplicación deja un evento "Requiere
 * revisión" en el historial del PEP, con la justificación/comentario ingresado (si lo hubo). */
export function aplicarN7MesesBatch(lineas: ForecastN4Linea[], updates: ForecastN7MesesBatchUpdate[]): ForecastN4Linea[] {
  const byN7Codigo = new Map(updates.map((u) => [u.n7Codigo, u]))
  return lineas.map((n4) => ({
    ...n4,
    n7: n4.n7.map((line) => {
      const update = byN7Codigo.get(line.n7Codigo)
      if (!update || update.n4Codigo !== n4.n4Codigo) return line
      const notas = update.notas ? { ...line.notas, ...Object.fromEntries(Object.keys(update.meses).map((k) => [k, update.notas!])) } : line.notas
      const comentario = update.notas?.comentario || update.notas?.justificacion
      const historial = [...line.historial, forecastHistorialEntry('Requiere revisión', comentario)]
      return { ...line, meses: { ...line.meses, ...update.meses }, tipoActualizacion: 'manual' as const, notas, historial }
    }),
  }))
}
