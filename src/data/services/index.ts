import { fixturesArgentinaColombia } from './fixtures-1'
import { fixturesUsaUruguay } from './fixtures-2'
import { fixturesAdicionales } from './fixtures-3'
import { buildFiltroOpciones, buildBanderasByDivision } from './filtros'
export { origenServicioOptions, origenServicioDe, type OrigenServicio } from './origen-servicio'

export type { Destino, EstadoServicio, Pais, Servicio, TipoOrigen } from './types'
export { convertMoneda, getDestinos, paisFlag, paisIpc, paisLabel, paisMoneda, paises, paisTasaCambioPromedio } from './paises'

export const servicios = [...fixturesArgentinaColombia, ...fixturesUsaUruguay, ...fixturesAdicionales]

export const filtroOpciones = buildFiltroOpciones(servicios)
export const banderasByDivision = buildBanderasByDivision(servicios)
