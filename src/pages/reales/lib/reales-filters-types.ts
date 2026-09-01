export interface RealesFilters {
  servicio: string
  codigo: string
  pais: string[]
  equipo: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  centroCosto: string[]
  asignacion: string[]
  bandera: string[]
  cuentaContable: string[]
  moneda: string[]
}

export const EMPTY_REALES_FILTERS: RealesFilters = {
  servicio: '', codigo: '', pais: [], equipo: [], gerenciaPadre: [], gerencia: [],
  centroCosto: [], asignacion: [], bandera: [], cuentaContable: [], moneda: [],
}

export interface RealesFilterOptions {
  pais: string[]
  equipo: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  centroCosto: string[]
  asignacion: string[]
  bandera: string[]
  cuentaContable: string[]
  moneda: string[]
}
