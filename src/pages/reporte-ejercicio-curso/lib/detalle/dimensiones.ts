import type { RealesRow } from '@/data/reales'

export interface NivelApertura {
  label: string
  keyFn: (r: RealesRow) => string
}

export interface AperturaUnidad {
  id: string
  label: string
  /** 1 o 2 niveles anidados — Gerencia/Equipo es la única unidad con 2 niveles reales en el modelo de
   * Reales (gerencia y equipo son campos distintos); División/Bandera usa un solo nivel (`bandera`) —
   * Reales no modela una "división" separada de la bandera. */
  niveles: NivelApertura[]
}

export const APERTURAS: AperturaUnidad[] = [
  { id: 'pais', label: 'País', niveles: [{ label: 'País', keyFn: (r) => r.pais }] },
  { id: 'divisionBandera', label: 'División / Bandera', niveles: [{ label: 'División / Bandera', keyFn: (r) => r.bandera }] },
  {
    id: 'gerenciaEquipo',
    label: 'Gerencia / Equipo',
    niveles: [
      { label: 'Gerencia', keyFn: (r) => r.gerencia },
      { label: 'Equipo', keyFn: (r) => r.equipo },
    ],
  },
  { id: 'rubro', label: 'Rubro', niveles: [{ label: 'Rubro', keyFn: (r) => r.rubro }] },
  { id: 'cuentaContable', label: 'Cuenta Contable', niveles: [{ label: 'Cuenta Contable', keyFn: (r) => r.cuentaContable }] },
  { id: 'servicio', label: 'Servicio', niveles: [{ label: 'Servicio', keyFn: (r) => r.nombre }] },
  { id: 'responsable', label: 'Responsable de cuenta', niveles: [{ label: 'Responsable de cuenta', keyFn: (r) => r.responsableCuenta }] },
]

export function aperturaLabel(id: string): string {
  return APERTURAS.find((a) => a.id === id)?.label ?? id
}
