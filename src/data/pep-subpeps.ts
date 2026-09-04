/** SubPEPs: entidades derivadas bajo un PEP N7. Compartido por Reales y Preliminares para que ambos módulos describan la misma línea de forma consistente. */
export interface PepSubPep {
  codigo: string
  nombre: string
  monto: number
}

/** Códigos de PEP N7 que tienen SubPEPs asociados. */
export const CON_SUBPEPS = new Set(['N7-001a', 'N7-002a', 'N7-004b', 'N7-009a'])

export function buildSubPeps(codigo: string, nombre: string, monto: number): PepSubPep[] {
  return [
    { codigo: `${codigo}-S1`, nombre: `${nombre} · Componente A`, monto: Math.round(monto * 0.6) },
    { codigo: `${codigo}-S2`, nombre: `${nombre} · Componente B`, monto: Math.round(monto * 0.4) },
  ]
}
