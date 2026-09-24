import { monthKeys, pepN4Tablon } from '@/data/reporteria'
import { pepN4Meta } from '@/data/pep-n4-meta'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import { calcLlaveDistribucion } from './forecast-llave'
import { findPlanN4, findPlanN7 } from './forecast-edit-calc'

export interface ForecastIdentidadBase {
  codServicio: string
  pais: string
  moneda: string
  gerenciaPadre: string
  gerencia: string
  equipo: string
  cuentaContable: string
  pep: string
  estado: string
}

/** Identidad de un servicio N4 para las columnas copiadas de ForecastN4Historico (F) — Estado se
 * deriva de datos reales (¿algún N7 hijo quedó en edición manual?); el resto sale de `pepN4Meta`
 * (data/pep-n4-meta.ts), la misma metadata de gestión que ya usan Reales y Preliminares para estos
 * PEP N4 — evita inventar una segunda fuente de Gerencia/Cuenta Contable/Bandera que quede
 * inconsistente entre módulos. */
export function n4Identidad(n4: ForecastN4Linea): ForecastIdentidadBase {
  const meta = pepN4Meta[n4.n4Codigo]
  const hasManual = n4.n7.some((l) => l.tipoActualizacion === 'manual')
  return {
    codServicio: n4.n4Codigo.replace('N4-', 'SVC-'),
    pais: n4.pais,
    moneda: meta?.moneda ?? '—',
    gerenciaPadre: meta?.gerenciaPadre ?? '—',
    gerencia: meta?.gerencia ?? '—',
    equipo: n4.equipo,
    cuentaContable: meta?.cuentaContable ?? '—',
    pep: n4.n4Codigo,
    estado: hasManual ? 'Manual' : 'Automático',
  }
}

function findPepN7Seed(n4Codigo: string, n7Codigo: string) {
  return pepN4Tablon.find((n4) => n4.codigo === n4Codigo)?.children.find((n7) => n7.codigo === n7Codigo)
}

export interface ForecastIdentidadN7 extends ForecastIdentidadBase {
  centroCosto: string
  bandera: string
  asignacion: string
  llavePlanPct: number
  llaveForecastPct: number
  motivo: string
  ultimaEdicion: string
}

/** Identidad de un PEP N7 para las columnas copiadas de ForecastN7Historico (F) — mismos datos de
 * `pepN4Meta` que el N4 padre (Gerencia/Cuenta Contable/Centro de costo/Bandera se gestionan a nivel
 * de servicio, no por PEP N7 individual). Estado y las dos Llave de Distribución usan datos reales
 * del propio forecast (tipoActualizacion, y el mismo cálculo de llave que ya distribuye montos
 * automáticos — ver forecast-llave.ts). */
export function n7Identidad(n4Codigo: string, n7: ForecastN7Linea, siblings: ForecastN7Linea[], cutoff: number): ForecastIdentidadN7 {
  const seed = findPepN7Seed(n4Codigo, n7.n7Codigo)
  const pais = seed?.pais ?? '—'
  const equipo = seed?.equipo ?? '—'
  const meta = pepN4Meta[n4Codigo]

  const planTotalN7 = monthKeys.reduce((s, k) => s + (findPlanN7(n4Codigo, n7.n7Codigo)[k] || 0), 0)
  const planTotalN4 = monthKeys.reduce((s, k) => s + (findPlanN4(n4Codigo)[k] || 0), 0)
  const llavePlanPct = planTotalN4 > 0 ? (planTotalN7 / planTotalN4) * 100 : 0
  const llaveForecastPct = calcLlaveDistribucion({ n7: siblings }, cutoff).find((l) => l.n7Codigo === n7.n7Codigo)?.pct ?? 0

  const motivo = Object.values(n7.notas).find((n) => n.justificacion)?.justificacion ?? '—'

  return {
    codServicio: n7.n7Codigo.replace('N7-', 'SVC7-'),
    pais,
    moneda: meta?.moneda ?? '—',
    gerenciaPadre: meta?.gerenciaPadre ?? '—',
    gerencia: meta?.gerencia ?? '—',
    equipo,
    centroCosto: meta?.centroCosto ?? '—',
    bandera: meta?.bandera ?? '—',
    cuentaContable: meta?.cuentaContable ?? '—',
    asignacion: meta?.asignacion ?? '—',
    llavePlanPct,
    llaveForecastPct,
    pep: n7.n7Codigo,
    estado: n7.tipoActualizacion === 'manual' ? 'Manual' : 'Automático',
    motivo,
    ultimaEdicion: '—',
  }
}
