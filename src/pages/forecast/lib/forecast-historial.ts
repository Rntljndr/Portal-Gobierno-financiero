import { monthLabelsShort } from '@/data/reporteria'
import type { ForecastRound } from '@/data/forecast'
import type { ForecastHistorialEntry, ForecastHistorialEstado, ForecastN7Linea } from '@/data/forecast-lineas'

/** Mismo usuario fijo que muestra el resto del portal (ver sidebar-footer.tsx/role-switcher.tsx) — no
 * hay login real, así que todo evento manual del historial queda a su nombre. */
export const FORECAST_USUARIO_ACTUAL = 'Andrea Morales'

export function formatFechaHistorial(d: Date): string {
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = monthLabelsShort[d.getMonth()].toLowerCase()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${dia} ${mes} ${d.getFullYear()}, ${hh}:${mm}`
}

export function forecastHistorialEntry(estado: ForecastHistorialEstado, comentario?: string): ForecastHistorialEntry {
  return { estado, fecha: formatFechaHistorial(new Date()), autor: FORECAST_USUARIO_ACTUAL, comentario }
}

/** Historial completo a mostrar en el drawer "Historial del PEP" (F) — más reciente primero, con un
 * evento base "Enviado" automático al final representando la apertura del forecast: ese primer evento
 * no vive en `n7.historial` (evita duplicar la fecha de apertura del round en cada PEP N7). */
export function forecastHistorialCompleto(n7: ForecastN7Linea, round: ForecastRound): ForecastHistorialEntry[] {
  const apertura: ForecastHistorialEntry = { estado: 'Enviado', fecha: formatFechaHistorial(new Date(`${round.fechaInicio}T${round.horaInicio}`)) }
  return [...n7.historial].reverse().concat(apertura)
}

/** Estado vigente del tag seleccionable — el evento más reciente, o "Enviado" (apertura) si el PEP
 * todavía no tuvo ningún evento manual. */
export function forecastEstadoVigente(n7: ForecastN7Linea): ForecastHistorialEstado {
  return n7.historial.length > 0 ? n7.historial[n7.historial.length - 1].estado : 'Enviado'
}

export const FORECAST_HISTORIAL_ESTILO: Record<ForecastHistorialEstado, { bg: string; border: string; color: string; icon: 'send' | 'alert' | 'check' | 'x_close' }> = {
  Enviado: { bg: '#EFF4FF', border: '#B6CCF7', color: '#0047B0', icon: 'send' },
  'Requiere revisión': { bg: '#FFFBEB', border: '#FCD34D', color: '#B45309', icon: 'alert' },
  Aprobado: { bg: '#ECFDF3', border: '#ABEFC6', color: '#067647', icon: 'check' },
  Rechazado: { bg: '#FEE8E8', border: '#FCA5A5', color: '#B42318', icon: 'x_close' },
}
