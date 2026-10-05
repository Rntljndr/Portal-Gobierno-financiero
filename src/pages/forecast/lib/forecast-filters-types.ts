export interface ForecastFilters {
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
  rubro: string[]
}

export const EMPTY_FORECAST_FILTERS: ForecastFilters = {
  servicio: '',
  codigo: '',
  pais: [],
  gerenciaPadre: [],
  gerencia: [],
  equipo: [],
  centroCosto: [],
  asignacion: [],
  bandera: [],
  cuentaContable: [],
  moneda: [],
  rubro: [],
}

export interface ForecastFilterOptions {
  pais: string[]
  gerenciaPadre: string[]
  gerencia: string[]
  equipo: string[]
  centroCosto: string[]
  asignacion: string[]
  bandera: string[]
  cuentaContable: string[]
  moneda: string[]
  rubro: string[]
}
