export type EstadoOrganizacional = 'Activo' | 'Inactivo'

export interface MiembroSeed {
  nombre: string
  email: string
  rol: 'Editor' | 'Visualizador'
  /** Año desde el que el miembro pertenece al equipo — no aparece en ejercicios anteriores. */
  desde: number
}

export interface EquipoSeed {
  id: string
  nombre: string
  desde: number
  /** Año desde el que el equipo queda Inactivo (sigue existiendo en el histórico, pero no Activo). */
  hasta?: number
  miembros: MiembroSeed[]
}

export interface GerenciaSeed {
  id: string
  nombre: string
  desde: number
  hasta?: number
  equipos: EquipoSeed[]
}

export interface AreaSeed {
  id: string
  nombre: string
  desde: number
  hasta?: number
  gerencias: GerenciaSeed[]
}
