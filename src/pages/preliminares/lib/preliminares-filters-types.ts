export interface PrelimFilters {
  servicio: string
  codigo: string
  pais: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
  centroCosto: string[]
  asignacion: string[]
  bandera: string[]
  cuentaContable: string[]
  moneda: string[]
  pep: string[]
}

export const EMPTY_PRELIM_FILTERS: PrelimFilters = {
  servicio: '', codigo: '', pais: [], gerenciaPadre: [], gerencia: [], equipo: [],
  centroCosto: [], asignacion: [], bandera: [], cuentaContable: [], moneda: [], pep: [],
}

export interface PrelimFilterOptions {
  pais: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
  centroCosto: string[]
  asignacion: string[]
  bandera: string[]
  cuentaContable: string[]
  moneda: string[]
  pep: string[]
}
