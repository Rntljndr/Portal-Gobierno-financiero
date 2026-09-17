import type { Servicio } from '@/data/services'
import type { Fragment } from './vista-amounts'

export type DimensionKey = 'paisDestino' | 'division' | 'gerenciaPadre' | 'gerencia' | 'servicio' | 'rubro' | 'tipoGasto'

export const DIMENSIONES: { key: DimensionKey; label: string }[] = [
  { key: 'paisDestino', label: 'País destino' },
  { key: 'division', label: 'División' },
  { key: 'gerenciaPadre', label: 'Gerencia padre' },
  { key: 'gerencia', label: 'Gerencia' },
  { key: 'servicio', label: 'Servicio' },
  { key: 'rubro', label: 'Rubro' },
  { key: 'tipoGasto', label: 'Tipo de gasto' },
]

/** "Tipo de gasto" mapea 1 a 1 al campo real `tipoOrigen` — a diferencia de Reportería Consolidada,
 * acá no hace falta ninguna regla provisoria: son exactamente las 2 categorías que soporta SIP hoy. */
export function tipoGastoDe(s: Servicio): string {
  return s.tipoOrigen === 'Recurrente' ? 'Recurrente' : 'Nuevo Servicio'
}

export interface DimensionLevel {
  label: string
  keyFn: (s: Servicio, frag: Fragment) => string
}

/** Cadena de apertura propia de cada pestaña — cada una agrupa por sus dimensiones de negocio
 * específicas antes de llegar al PEP N4, en vez de compartir una única estructura genérica. */
export const DIMENSION_LEVELS: Record<DimensionKey, DimensionLevel[]> = {
  paisDestino: [
    { label: 'País destino', keyFn: (_s, f) => f.pais },
    { label: 'División', keyFn: (s) => s.division },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
  ],
  division: [
    { label: 'División', keyFn: (s) => s.division },
    { label: 'Gerencia', keyFn: (s) => s.gerencia },
    { label: 'Equipo', keyFn: (s) => s.equipo },
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
}
