import { fixturesArgentinaColombia } from './fixtures-1'
import { fixturesUsaUruguay } from './fixtures-2'
import { fixturesAdicionales } from './fixtures-3'
import { buildFiltroOpciones } from './filtros'

export type { Destino, EstadoServicio, Pais, Servicio, TipoOrigen } from './types'
export { convertMoneda, getDestinos, paisFlag, paisIpc, paisLabel, paisMoneda, paises } from './paises'

export const servicios = [...fixturesArgentinaColombia, ...fixturesUsaUruguay, ...fixturesAdicionales]

export const filtroOpciones = buildFiltroOpciones(servicios)
