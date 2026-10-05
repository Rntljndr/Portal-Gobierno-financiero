import type { ForecastN4Linea } from '@/data/forecast-lineas'
import type { ForecastFlatN7Row } from './forecast-flat-n7'
import { n4Identidad, n7Identidad } from './forecast-identidad'
import type { ForecastFilterOptions, ForecastFilters } from './forecast-filters-types'

function distinct(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
}

/** Opciones de los MultiSelect — se recalculan sobre las filas visibles del tab actual (F: "igual que
 * en reales"), N4 solo tiene país/gerencias/equipo/cuenta/moneda, N7 suma centro de costo, asignación
 * y bandera (mismas columnas de identidad ya agregadas a las tablas). */
export function buildForecastN4Options(rows: ForecastN4Linea[]): ForecastFilterOptions {
  const idents = rows.map(n4Identidad)
  return {
    pais: distinct(idents.map((i) => i.pais)),
    gerenciaPadre: distinct(idents.map((i) => i.gerenciaPadre)),
    gerencia: distinct(idents.map((i) => i.gerencia)),
    equipo: distinct(idents.map((i) => i.equipo)),
    cuentaContable: distinct(idents.map((i) => i.cuentaContable)),
    moneda: distinct(idents.map((i) => i.moneda)),
    rubro: distinct(idents.map((i) => i.rubro)),
    centroCosto: [],
    asignacion: [],
    bandera: [],
  }
}

export function buildForecastN7Options(rows: ForecastFlatN7Row[], cutoff: number): ForecastFilterOptions {
  const idents = rows.map((r) => n7Identidad(r.n4Codigo, r.n7, r.n4Siblings, cutoff))
  return {
    pais: distinct(idents.map((i) => i.pais)),
    gerenciaPadre: distinct(idents.map((i) => i.gerenciaPadre)),
    gerencia: distinct(idents.map((i) => i.gerencia)),
    equipo: distinct(idents.map((i) => i.equipo)),
    centroCosto: distinct(idents.map((i) => i.centroCosto)),
    asignacion: distinct(idents.map((i) => i.asignacion)),
    bandera: distinct(idents.map((i) => i.bandera)),
    cuentaContable: distinct(idents.map((i) => i.cuentaContable)),
    moneda: distinct(idents.map((i) => i.moneda)),
    rubro: distinct(idents.map((i) => i.rubro)),
  }
}

export function forecastActiveFilterCount(f: ForecastFilters): number {
  return Object.values(f).filter((v) => (Array.isArray(v) ? v.length > 0 : v.trim() !== '')).length
}

export function applyForecastN4Filters(rows: ForecastN4Linea[], f: ForecastFilters): ForecastN4Linea[] {
  return rows.filter((n4) => {
    if (f.servicio && !n4.n4Nombre.toLowerCase().includes(f.servicio.toLowerCase())) return false
    if (f.codigo && !n4.n4Codigo.toLowerCase().includes(f.codigo.toLowerCase())) return false
    const idn = n4Identidad(n4)
    if (f.pais.length && !f.pais.includes(idn.pais)) return false
    if (f.gerenciaPadre.length && !f.gerenciaPadre.includes(idn.gerenciaPadre)) return false
    if (f.gerencia.length && !f.gerencia.includes(idn.gerencia)) return false
    if (f.equipo.length && !f.equipo.includes(idn.equipo)) return false
    if (f.cuentaContable.length && !f.cuentaContable.includes(idn.cuentaContable)) return false
    if (f.moneda.length && !f.moneda.includes(idn.moneda)) return false
    if (f.rubro.length && !f.rubro.includes(idn.rubro)) return false
    return true
  })
}

export function applyForecastN7Filters(rows: ForecastFlatN7Row[], f: ForecastFilters, cutoff: number): ForecastFlatN7Row[] {
  return rows.filter((r) => {
    if (f.servicio && !r.n7.n7Nombre.toLowerCase().includes(f.servicio.toLowerCase()) && !r.n4Nombre.toLowerCase().includes(f.servicio.toLowerCase())) return false
    if (f.codigo && !r.n7.n7Codigo.toLowerCase().includes(f.codigo.toLowerCase())) return false
    const idn = n7Identidad(r.n4Codigo, r.n7, r.n4Siblings, cutoff)
    if (f.pais.length && !f.pais.includes(idn.pais)) return false
    if (f.gerenciaPadre.length && !f.gerenciaPadre.includes(idn.gerenciaPadre)) return false
    if (f.gerencia.length && !f.gerencia.includes(idn.gerencia)) return false
    if (f.equipo.length && !f.equipo.includes(idn.equipo)) return false
    if (f.centroCosto.length && !f.centroCosto.includes(idn.centroCosto)) return false
    if (f.asignacion.length && !f.asignacion.includes(idn.asignacion)) return false
    if (f.bandera.length && !f.bandera.includes(idn.bandera)) return false
    if (f.cuentaContable.length && !f.cuentaContable.includes(idn.cuentaContable)) return false
    if (f.moneda.length && !f.moneda.includes(idn.moneda)) return false
    if (f.rubro.length && !f.rubro.includes(idn.rubro)) return false
    return true
  })
}
