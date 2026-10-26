export type UsuarioSipRol = 'Usuario' | 'Seguridad' | 'Gobierno'

export interface UsuarioSip {
  id: string
  nombre: string
  email: string
  rol: UsuarioSipRol
  estado: 'Activo' | 'Inactivo'
}

export const USUARIOS_SIP: UsuarioSip[] = [
  { id: 'u-andrea-morales', nombre: 'Andrea Morales', email: 'andrea.morales@cencosud.com', rol: 'Usuario', estado: 'Activo' },
  { id: 'u-renato-galecio', nombre: 'Renato Galecio', email: 'renato.galecio@cencosud.com', rol: 'Gobierno', estado: 'Activo' },
  { id: 'u-camila-reyes', nombre: 'Camila Reyes', email: 'camila.reyes@cencosud.com', rol: 'Usuario', estado: 'Activo' },
  { id: 'u-francisco-lagos', nombre: 'Francisco Lagos', email: 'francisco.lagos@cencosud.com', rol: 'Seguridad', estado: 'Activo' },
  { id: 'u-valentina-prieto', nombre: 'Valentina Prieto', email: 'valentina.prieto@cencosud.com', rol: 'Usuario', estado: 'Activo' },
  { id: 'u-matias-donoso', nombre: 'Matías Donoso', email: 'matias.donoso@cencosud.com', rol: 'Usuario', estado: 'Inactivo' },
  { id: 'u-josefina-tapia', nombre: 'Josefina Tapia', email: 'josefina.tapia@cencosud.com', rol: 'Seguridad', estado: 'Activo' },
  { id: 'u-diego-salinas', nombre: 'Diego Salinas', email: 'diego.salinas@cencosud.com', rol: 'Gobierno', estado: 'Activo' },
]

export interface PermisoSeed {
  /** Id de un nodo de `estructuraParaAnio` (área, gerencia o equipo) — ver/editar se asigna sobre él y,
   * si es área o gerencia, se hereda en vivo a sus descendientes vigentes ese año. */
  nodoId: string
  ver: boolean
  editar: boolean
  /** Año desde el que rige este alcance (F: "al seleccionar el año trae las configuraciones ejecutadas
   * ese año") — antes de `desde` el usuario no tenía este alcance asignado. */
  desde: number
}

/** Alcances asignados por usuario — histórico plano, filtrado por año en `use-alcances-permisos.ts`. */
export const PERMISOS_SIP_SEED: Record<string, PermisoSeed[]> = {
  'u-andrea-morales': [
    { nodoId: 'ger-pmo', ver: true, editar: true, desde: 2024 },
    { nodoId: 'ger-finanzas-corp', ver: true, editar: false, desde: 2025 },
  ],
  'u-renato-galecio': [
    { nodoId: 'area-estrategia', ver: true, editar: true, desde: 2024 },
    { nodoId: 'area-tecnologia', ver: true, editar: false, desde: 2026 },
  ],
  'u-camila-reyes': [{ nodoId: 'eq-frontend', ver: true, editar: true, desde: 2024 }],
  'u-francisco-lagos': [
    { nodoId: 'ger-it-seguridad', ver: true, editar: true, desde: 2024 },
    { nodoId: 'eq-soc', ver: true, editar: true, desde: 2024 },
  ],
  'u-valentina-prieto': [{ nodoId: 'ger-ecommerce', ver: true, editar: false, desde: 2025 }],
  'u-matias-donoso': [{ nodoId: 'eq-planificacion', ver: true, editar: false, desde: 2024 }],
  'u-josefina-tapia': [{ nodoId: 'area-digital', ver: true, editar: false, desde: 2026 }],
  'u-diego-salinas': [
    { nodoId: 'area-tecnologia', ver: true, editar: true, desde: 2024 },
    { nodoId: 'area-operaciones', ver: true, editar: true, desde: 2024 },
  ],
}
