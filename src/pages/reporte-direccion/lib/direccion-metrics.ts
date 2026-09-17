import type { DireccionLeaf } from '@/data/reporte-direccion'

export interface DireccionMetrics {
  sIngresosReal: number
  sIngresosPlan: number
  sIngresosAnterior: number
  varVsPlan: number
  varPct: number
  varAA: number
  varAAPct: number
}

export function computeDireccionMetrics(l: DireccionLeaf): DireccionMetrics {
  const varVsPlan = l.real - l.plan
  const varAA = l.real - l.realAnterior
  return {
    sIngresosReal: l.ingresosReal ? (l.real / l.ingresosReal) * 100 : 0,
    sIngresosPlan: l.ingresosPlan ? (l.plan / l.ingresosPlan) * 100 : 0,
    sIngresosAnterior: l.ingresosAnterior ? (l.realAnterior / l.ingresosAnterior) * 100 : 0,
    varVsPlan,
    varPct: l.plan ? (varVsPlan / l.plan) * 100 : 0,
    varAA,
    varAAPct: l.realAnterior ? (varAA / l.realAnterior) * 100 : 0,
  }
}
