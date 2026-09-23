import type { Servicio } from '@/data/services'
import type { Fragment } from './vista-amounts'

export type DimensionKey =
  | 'paisDestino'
  | 'paisOrigen'
  | 'division'
  | 'gerenciaPadre'
  | 'gerencia'
  | 'equipo'
  | 'servicio'
  | 'rubro'
  | 'tipoGasto'
  | 'justificacionDesvio'

export const DIMENSIONES: { key: DimensionKey; label: string }[] = [
  { key: 'paisDestino', label: 'País destino' },
  { key: 'paisOrigen', label: 'País origen' },
  { key: 'division', label: 'División' },
  { key: 'gerenciaPadre', label: 'Gerencia padre' },
  { key: 'gerencia', label: 'Gerencia' },
  { key: 'equipo', label: 'Equipo' },
  { key: 'servicio', label: 'Servicio' },
  { key: 'rubro', label: 'Rubro' },
  { key: 'tipoGasto', label: 'Tipo de gasto' },
  { key: 'justificacionDesvio', label: 'Justificación de desvío' },
]

/** "Tipo de gasto" mapea 1 a 1 al campo real `tipoOrigen` — a diferencia de Reportería Consolidada,
 * acá no hace falta ninguna regla provisoria: son exactamente las 2 categorías que soporta SIP hoy. */
export function tipoGastoDe(s: Servicio): string {
  return s.tipoOrigen === 'Recurrente' ? 'Recurrente' : 'Nuevo Servicio'
}

const DESVIO_CATEGORIAS = ['Sin desvío informado', 'Ajuste Tarifa', 'Nuevo Servicio Pedido x UN', 'Desvío por Tipo de Cambio']

function hashStr(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

/** MOCK — "Justificación de desvío" no está modelado en `Servicio`; se asigna una categoría
 * determinística por servicio solo para poder abrir esta pestaña. Reemplazar por el campo real
 * cuando exista en el sistema de origen. */
export function justificacionDesvioDe(s: Servicio): string {
  return DESVIO_CATEGORIAS[hashStr(s.id) % DESVIO_CATEGORIAS.length]
}

export interface DimensionLevel {
  label: string
  keyFn: (s: Servicio, frag: Fragment) => string
}

/** Cadena de apertura propia de cada pestaña — cada una agrupa por sus dimensiones de negocio
 * específicas antes de llegar a la hoja final (`LEAF_LABEL`: PEP N4 en la mayoría, Servicio en
 * Equipo y Justificación de desvío). */
export const DIMENSION_LEVELS: Record<DimensionKey, DimensionLevel[]> = {
  paisDestino: [
    { label: 'País destino', keyFn: (_s, f) => f.pais },
    { label: 'División', keyFn: (s) => s.division },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
  ],
  paisOrigen: [
    { label: 'País origen', keyFn: (s) => s.pais },
    { label: 'División', keyFn: (s) => s.division },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
  ],
  division: [
    { label: 'División', keyFn: (s) => s.division },
    { label: 'Bandera', keyFn: (s) => s.bandera },
  ],
  gerenciaPadre: [
    { label: 'Gerencia padre', keyFn: (s) => s.gerenciaPadre },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
    { label: 'País destino', keyFn: (_s, f) => f.pais },
  ],
  gerencia: [
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
    { label: 'Equipo', keyFn: (s) => s.equipo },
    { label: 'Cuenta contable', keyFn: (s) => s.cuentaContable },
  ],
  equipo: [
    { label: 'Equipo', keyFn: (s) => s.equipo },
    { label: 'Cuenta contable', keyFn: (s) => s.cuentaContable },
  ],
  servicio: [
    { label: 'Servicio', keyFn: (s) => s.nombre },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
  ],
  rubro: [
    { label: 'Rubro', keyFn: (s) => s.rubro },
    { label: 'Cuenta contable', keyFn: (s) => s.cuentaContable },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
  ],
  tipoGasto: [
    { label: 'Tipo de gasto', keyFn: (s) => tipoGastoDe(s) },
    { label: 'País destino', keyFn: (_s, f) => f.pais },
    { label: 'Gerencia padre', keyFn: (s) => s.gerenciaPadre },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
  ],
  justificacionDesvio: [
    { label: 'Justificación de desvío', keyFn: (s) => justificacionDesvioDe(s) },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
    { label: 'Equipo', keyFn: (s) => s.equipo },
  ],
}

/** Hoja final de cada pestaña: PEP N4 en la mayoría; Equipo y Justificación de desvío llegan solo
 * hasta Servicio (en este mock 1 servicio = 1 línea PEP N4, así que el detalle no cambia). */
export const LEAF_LABEL: Record<DimensionKey, string> = {
  paisDestino: 'PEP N4',
  paisOrigen: 'PEP N4',
  division: 'PEP N4',
  gerenciaPadre: 'PEP N4',
  gerencia: 'PEP N4',
  equipo: 'Servicio',
  servicio: 'PEP N4',
  rubro: 'PEP N4',
  tipoGasto: 'PEP N4',
  justificacionDesvio: 'Servicio',
}
