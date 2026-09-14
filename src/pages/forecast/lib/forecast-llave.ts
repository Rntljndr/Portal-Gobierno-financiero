import { monthKeys } from '@/data/reporteria'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import { calcN4Meses } from './forecast-edit-calc'

export interface LlaveSegment {
  n7Codigo: string
  n7Nombre: string
  pct: number
  manual: boolean
}

function realAcumulado(meses: Record<string, number>, cutoff: number): number {
  return monthKeys.slice(0, cutoff).reduce((s, k) => s + (meses[k] || 0), 0)
}

/** % de cada N7 sobre el real acumulado del N4 — se recalcula en vivo a medida que caen Reales, nunca se persiste. */
export function calcLlaveDistribucion(n4: ForecastN4Linea, cutoff: number): LlaveSegment[] {
  const totals = n4.n7.map((n7) => ({ n7, real: realAcumulado(n7.meses, cutoff) }))
  const totalReal = totals.reduce((s, t) => s + t.real, 0)
  if (totalReal <= 0) {
    const evenPct = n4.n7.length > 0 ? 100 / n4.n7.length : 0
    return n4.n7.map((n7) => ({ n7Codigo: n7.n7Codigo, n7Nombre: n7.n7Nombre, pct: evenPct, manual: n7.tipoActualizacion === 'manual' }))
  }
  return totals.map(({ n7, real }) => ({ n7Codigo: n7.n7Codigo, n7Nombre: n7.n7Nombre, pct: (real / totalReal) * 100, manual: n7.tipoActualizacion === 'manual' }))
}

/** Distribuye `monto` para `monthKey` del N4 entre sus N7 automáticos, proporcional a la llave vigente. Los N7 `manual` quedan intactos. */
export function distribuirMontoN4(n4: ForecastN4Linea, monthKey: string, monto: number, cutoff: number): ForecastN7Linea[] {
  const llave = calcLlaveDistribucion(n4, cutoff)
  const manualCodes = new Set(n4.n7.filter((n7) => n7.tipoActualizacion === 'manual').map((n7) => n7.n7Codigo))
  const manualTotal = n4.n7.filter((n7) => manualCodes.has(n7.n7Codigo)).reduce((s, n7) => s + (n7.meses[monthKey] || 0), 0)
  const automaticos = llave.filter((l) => !manualCodes.has(l.n7Codigo))
  const pctTotal = automaticos.reduce((s, l) => s + l.pct, 0)
  const remanente = monto - manualTotal

  let acumuladoAsignado = 0
  const nuevosMontos = new Map<string, number>()
  automaticos.forEach((l, i) => {
    if (i === automaticos.length - 1) {
      nuevosMontos.set(l.n7Codigo, Math.round(remanente - acumuladoAsignado))
      return
    }
    const share = pctTotal > 0 ? Math.round((remanente * l.pct) / pctTotal) : 0
    nuevosMontos.set(l.n7Codigo, share)
    acumuladoAsignado += share
  })

  return n4.n7.map((n7) => {
    if (manualCodes.has(n7.n7Codigo)) return n7
    return { ...n7, meses: { ...n7.meses, [monthKey]: nuevosMontos.get(n7.n7Codigo) ?? 0 } }
  })
}

/** Vuelve un N7 a `automatica` y re-aplica la llave sobre los meses de forecast (>= cutoff), sin alterar el total N4 vigente en cada mes. */
export function restablecerLlaveN7(n4: ForecastN4Linea, n7Codigo: string, cutoff: number): ForecastN4Linea {
  const targetPorMes = calcN4Meses(n4)
  let working: ForecastN4Linea = { ...n4, n7: n4.n7.map((n7) => (n7.n7Codigo === n7Codigo ? { ...n7, tipoActualizacion: 'automatica' as const } : n7)) }
  monthKeys.forEach((k, i) => {
    if (i < cutoff) return
    working = { ...working, n7: distribuirMontoN4(working, k, targetPorMes[k], cutoff) }
  })
  return working
}
