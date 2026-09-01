export interface PepN7Filters {
  servicio: string
  cod: string
  bandera: string
  destino: string
  ceco: string
}

export const EMPTY_N7_FILTERS: PepN7Filters = { servicio: '', cod: '', bandera: '', destino: '', ceco: '' }
