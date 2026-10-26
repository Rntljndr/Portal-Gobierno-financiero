import { realesN7Rows } from '@/data/reales'

export interface DetalleFiltros {
  pais: string[]
  gerencia: string[]
  bandera: string[]
  cuentaContable: string[]
  rubro: string[]
}

export const DETALLE_FILTROS_VACIOS: DetalleFiltros = { pais: [], gerencia: [], bandera: [], cuentaContable: [], rubro: [] }

export const GERENCIA_OPTIONS = [...new Set(realesN7Rows.map((r) => r.gerencia))].sort((a, b) => a.localeCompare(b, 'es'))
export const BANDERA_OPTIONS = [...new Set(realesN7Rows.map((r) => r.bandera))].sort((a, b) => a.localeCompare(b, 'es'))
export const CUENTA_OPTIONS = [...new Set(realesN7Rows.map((r) => r.cuentaContable))].sort((a, b) => a.localeCompare(b, 'es'))
export const RUBRO_OPTIONS = [...new Set(realesN7Rows.map((r) => r.rubro))].sort((a, b) => a.localeCompare(b, 'es'))

export function contarFiltrosActivos(filtros: DetalleFiltros): number {
  return (Object.keys(filtros) as (keyof DetalleFiltros)[]).filter((k) => filtros[k].length > 0).length
}

export function filtrarRows(filtros: DetalleFiltros) {
  return realesN7Rows.filter(
    (r) =>
      (!filtros.pais.length || filtros.pais.includes(r.pais)) &&
      (!filtros.gerencia.length || filtros.gerencia.includes(r.gerencia)) &&
      (!filtros.bandera.length || filtros.bandera.includes(r.bandera)) &&
      (!filtros.cuentaContable.length || filtros.cuentaContable.includes(r.cuentaContable)) &&
      (!filtros.rubro.length || filtros.rubro.includes(r.rubro)),
  )
}
