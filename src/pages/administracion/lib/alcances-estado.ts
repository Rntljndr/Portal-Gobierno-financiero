import type { DraftPermisos } from './use-alcances-permisos'

export interface NodoEstado {
  asignado: boolean
  ver: boolean
  editar: boolean
}

/** Estado agregado Ver/Editar de un nodo (área, gerencia o equipo) a partir de los ids de equipo que
 * tiene debajo — `asignado` si al menos uno ya tiene `ver`, `ver`/`editar` solo si TODOS lo tienen. */
export function estadoDeIds(ids: string[], draft: DraftPermisos): NodoEstado {
  if (ids.length === 0) return { asignado: false, ver: false, editar: false }
  return { asignado: ids.some((id) => draft[id]?.ver), ver: ids.every((id) => draft[id]?.ver), editar: ids.every((id) => draft[id]?.editar) }
}
