import { pepN4Tablon } from '@/data/reporteria'
import { pepN4Meta, type PepRubro } from '@/data/pep-n4-meta'
import type { ForecastEnvioEstado, ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import { calcLlaveDistribucion } from './forecast-llave'
import { calcN4Completitud } from './forecast-completitud'

export interface ForecastIdentidadBase {
  /** Código PEP completo (A8: homologado con Reales — antes era un "Cod de servicio" sintético
   * distinto del PEP N4/N7, ahora es el mismo dato que muestra la columna "Código" de Reales). */
  pep: string
  pais: string
  gerenciaPadre: string
  gerencia: string
  equipo: string
  cuentaContable: string
  moneda: string
  /** F: "en los filtros de N4 y N7 se debe agregar el rubro, también en las columnas se debe agregar
   * el rubro" — mismo origen que el resto de la identidad (pepN4Meta), no existe por PEP N7 individual. */
  rubro: PepRubro
  estado: string
}

export interface ForecastIdentidadN4 extends ForecastIdentidadBase {
  /** % de completitud del N4 (M6) — columna propia, al lado de Moneda; no existe a nivel N7. */
  completitudPct: number
}

/** Identidad de un servicio N4 para las columnas copiadas de ForecastN4Historico (F) — Estado se
 * deriva de datos reales (¿algún N7 hijo quedó en edición manual?); el resto sale de `pepN4Meta`
 * (data/pep-n4-meta.ts), la misma metadata de gestión que ya usan Reales y Preliminares para estos
 * PEP N4 — evita inventar una segunda fuente de Gerencia/Cuenta Contable/Bandera que quede
 * inconsistente entre módulos. */
export function n4Identidad(n4: ForecastN4Linea): ForecastIdentidadN4 {
  const meta = pepN4Meta[n4.n4Codigo]
  const hasManual = n4.n7.some((l) => l.tipoActualizacion === 'manual')
  return {
    pep: n4.n4Codigo,
    pais: n4.pais,
    gerenciaPadre: meta?.gerenciaPadre ?? '—',
    gerencia: meta?.gerencia ?? '—',
    equipo: n4.equipo,
    cuentaContable: meta?.cuentaContable ?? '—',
    moneda: meta?.moneda ?? '—',
    rubro: meta?.rubro ?? 'OPEX',
    estado: hasManual ? 'Manual' : 'Automático',
    completitudPct: calcN4Completitud(n4),
  }
}

function findPepN7Seed(n4Codigo: string, n7Codigo: string) {
  return pepN4Tablon.find((n4) => n4.codigo === n4Codigo)?.children.find((n7) => n7.codigo === n7Codigo)
}

export interface ForecastIdentidadN7 extends ForecastIdentidadBase {
  centroCosto: string
  asignacion: string
  bandera: string
  /** Llave de Distribución vigente del forecast (C5: única columna, comparación vertical contra la
   * llave del plan que muestra la fila de Plan — ver calcLlavePlanPct). No existe en Reales (A8). */
  llaveDistribucionPct: number
  ultimaEdicion: string
  /** F: columna "Estado" al lado de la Llave de Distribución — Enviado (verde) si ya salió de
   * "Abierto"/"Rechazado", No enviado (gris) si no. */
  envioEstado: ForecastEnvioEstado
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

  const llaveDistribucionPct = calcLlaveDistribucion({ n7: siblings }, cutoff).find((l) => l.n7Codigo === n7.n7Codigo)?.pct ?? 0

  return {
    pep: n7.n7Codigo,
    pais,
    gerenciaPadre: meta?.gerenciaPadre ?? '—',
    gerencia: meta?.gerencia ?? '—',
    equipo,
    centroCosto: meta?.centroCosto ?? '—',
    asignacion: meta?.asignacion ?? '—',
    bandera: meta?.bandera ?? '—',
    cuentaContable: meta?.cuentaContable ?? '—',
    moneda: meta?.moneda ?? '—',
    rubro: meta?.rubro ?? 'OPEX',
    llaveDistribucionPct,
    estado: n7.tipoActualizacion === 'manual' ? 'Manual' : 'Automático',
    ultimaEdicion: '—',
    envioEstado: n7.envioEstado,
  }
}

/** F: valor comparable de una columna de identidad, para el chevron de orden de cada columna —
 * mismas keys que FORECAST_IDENTITY_N4_COLS/FORECAST_IDENTITY_N7_COLS. 'estado' es ambiguo entre
 * niveles: en N7 es el envío (Enviado/No enviado, lo que realmente muestra esa columna — ver
 * ForecastIdentityCells), en N4 es `identidad.estado` (Manual/Automático, la única variante que existe
 * ahí). 'llave' y 'completitud' solo existen en un nivel; el otro no se usa nunca con esa key. */
export function forecastIdentitySortValue(identidad: ForecastIdentidadN4 | ForecastIdentidadN7, key: string): string | number {
  switch (key) {
    case 'codigo':
      return identidad.pep
    case 'pais':
      return identidad.pais
    case 'gerenciaPadre':
      return identidad.gerenciaPadre
    case 'gerencia':
      return identidad.gerencia
    case 'equipo':
      return identidad.equipo
    case 'cuentaContable':
      return identidad.cuentaContable
    case 'moneda':
      return identidad.moneda
    case 'rubro':
      return identidad.rubro
    case 'completitud':
      return 'completitudPct' in identidad ? identidad.completitudPct : 0
    case 'centroCosto':
      return 'centroCosto' in identidad ? identidad.centroCosto : ''
    case 'asignacion':
      return 'asignacion' in identidad ? identidad.asignacion : ''
    case 'bandera':
      return 'bandera' in identidad ? identidad.bandera : ''
    case 'llave':
      return 'llaveDistribucionPct' in identidad ? identidad.llaveDistribucionPct : 0
    case 'estado':
      return 'envioEstado' in identidad ? identidad.envioEstado : identidad.estado
    default:
      return ''
  }
}
