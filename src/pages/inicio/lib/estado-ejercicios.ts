import { convertMoneda, servicios, type EstadoServicio } from '@/data/services'
import { V3_MES_EN_CURSO, V3_MESES_CERRADOS, v3Gestion, v3Lineas } from '@/data/gasto-it-v3'

const sum = (xs: number[]) => xs.reduce((s, v) => s + v, 0)
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)

/** "USD 87,8 M" / "USD 850 K", con signo opcional — mismo formato que los reportes. */
export function fmtUsd(n: number, signed = false): string {
  const abs = Math.abs(n)
  const sign = signed ? (n > 0 ? '+' : n < 0 ? '−' : '') : n < 0 ? '−' : ''
  if (abs >= 1e6) return `${sign}USD ${(abs / 1e6).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`
  return `${sign}USD ${Math.round(abs / 1e3).toLocaleString('es-CL')} K`
}

export const fmtPct = (n: number, signed = false) =>
  `${signed && n > 0.05 ? '+' : ''}${n.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`

/** Ejercicio en planificación: avance de las líneas por estado y plan contra el forecast del año en curso. */
export interface EstadoPlanificacion {
  porEstado: Record<EstadoServicio, number>
  total: number
  planUsd: number
  forecastUsd: number
  varPct: number
}

export function estadoPlanificacion(): EstadoPlanificacion {
  const porEstado: Record<EstadoServicio, number> = { Aprobado: 0, Enviado: 0, 'Requiere revisión': 0, Borrador: 0 }
  let planUsd = 0
  let forecastUsd = 0
  for (const s of servicios) {
    porEstado[s.estado]++
    planUsd += convertMoneda(s.totalPlan, s.pais, 'Estados Unidos')
    forecastUsd += convertMoneda(s.forecastBase, s.pais, 'Estados Unidos')
  }
  return { porEstado, total: servicios.length, planUsd, forecastUsd, varPct: pct(planUsd - forecastUsd, forecastUsd) }
}

/** Ejercicio en curso: real acumulado y proyección anual contra el plan, preliminar del mes abierto y forecast
 * en edición contra el anterior (datos del Reporte ejercicio en curso). */
export interface EstadoEnCurso {
  realAcum: number
  planAcum: number
  desvAcumPct: number
  proyectado: number
  planAnual: number
  desvAnualPct: number
  prelimAvancePct: number
  prelim: number
  fcstMes: number
  fcstDif: number
  fcstModificadas: number
  lineas: number
}

export function estadoEnCurso(): EstadoEnCurso {
  const c = V3_MESES_CERRADOS
  const realAcum = sum(v3Lineas.map((l) => sum(l.realForecast.slice(0, c))))
  const planAcum = sum(v3Lineas.map((l) => sum(l.plan.slice(0, c))))
  const proyectado = sum(v3Lineas.map((l) => sum(l.realForecast)))
  const planAnual = sum(v3Lineas.map((l) => sum(l.plan)))
  const fcstAnterior = sum(v3Lineas.map((l) => sum(v3Gestion[l.id].forecastAnterior)))
  const prelim = sum(v3Lineas.map((l) => v3Gestion[l.id].preliminar))
  const fcstMes = sum(v3Lineas.map((l) => l.realForecast[V3_MES_EN_CURSO]))
  const fcstModificadas = v3Lineas.filter((l) => Math.abs(sum(l.realForecast) - sum(v3Gestion[l.id].forecastAnterior)) > 0.5).length
  return {
    realAcum,
    planAcum,
    desvAcumPct: pct(realAcum - planAcum, planAcum),
    proyectado,
    planAnual,
    desvAnualPct: pct(proyectado - planAnual, planAnual),
    prelimAvancePct: pct(prelim, fcstMes),
    prelim,
    fcstMes,
    fcstDif: proyectado - fcstAnterior,
    fcstModificadas,
    lineas: v3Lineas.length,
  }
}
