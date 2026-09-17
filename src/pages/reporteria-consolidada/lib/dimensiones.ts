import { origenServicioDe, type Servicio } from '@/data/services'
import type { Fragment } from './vista-amounts'

/** Las 8 dimensiones agrupables por las que sí hay dato real en SIP. "Justificación de Desvío" existe en la
 * herramienta ad hoc pero no tiene campo equivalente en los fixtures actuales — se deja fuera a propósito. */
export type DimensionKey = 'gerenciaPadre' | 'division' | 'paisOrigen' | 'paisDestino' | 'rubro' | 'cuentaContable' | 'equipo' | 'origenServicio'

export const DIMENSIONES: { key: DimensionKey; label: string }[] = [
  { key: 'gerenciaPadre', label: 'Gerencia' },
  { key: 'division', label: 'División' },
  { key: 'paisOrigen', label: 'País Origen' },
  { key: 'paisDestino', label: 'País Destino' },
  { key: 'rubro', label: 'Rubro' },
  { key: 'cuentaContable', label: 'Cuenta Contable' },
  { key: 'equipo', label: 'Equipo' },
  { key: 'origenServicio', label: 'Origen del Servicio' },
]

export function dimensionKeyValue(dim: DimensionKey, s: Servicio, fragment: Fragment): string {
  switch (dim) {
    case 'gerenciaPadre': return s.gerenciaPadre
    case 'division': return s.division
    case 'paisOrigen': return s.pais
    case 'paisDestino': return fragment.pais
    case 'rubro': return s.rubro
    case 'cuentaContable': return s.cuentaContable
    case 'equipo': return s.equipo
    case 'origenServicio': return origenServicioDe(s)
  }
}
