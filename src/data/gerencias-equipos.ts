import { GERENCIAS_EQUIPOS_SEED, type EstadoOrganizacional } from './gerencias-equipos-seed'

export type { EstadoOrganizacional }
export { GERENCIAS_EQUIPOS_SEED }

export const GERENCIAS_EQUIPOS_ANIOS = [2027, 2026, 2025, 2024]

export interface Miembro {
  id: string
  nombre: string
  email: string
  rol: 'Editor' | 'Visualizador'
}

export interface EquipoNodo {
  id: string
  tipo: 'equipo'
  nombre: string
  estado: EstadoOrganizacional
  miembros: Miembro[]
}

export interface GerenciaNodo {
  id: string
  tipo: 'gerencia'
  nombre: string
  estado: EstadoOrganizacional
  equipos: EquipoNodo[]
}

export interface AreaNodo {
  id: string
  tipo: 'area'
  nombre: string
  estado: EstadoOrganizacional
  gerencias: GerenciaNodo[]
}

function estadoEn(anio: number, hasta: number | undefined): EstadoOrganizacional {
  return hasta !== undefined && anio >= hasta ? 'Inactivo' : 'Activo'
}

/** Reconstruye la estructura organizacional vigente en `anio` (Área > Gerencia > Equipo > Miembro, ver
 * `gerencias-equipos-seed.ts`) — cada nodo con `desde > anio` queda excluido (F: "trae las
 * configuraciones ejecutadas ese año"), y los que tienen `hasta <= anio` siguen apareciendo
 * (histórico) pero en estado Inactivo. */
export function estructuraParaAnio(anio: number): AreaNodo[] {
  return GERENCIAS_EQUIPOS_SEED.filter((a) => a.desde <= anio).map((area) => ({
    id: area.id,
    tipo: 'area',
    nombre: area.nombre,
    estado: estadoEn(anio, area.hasta),
    gerencias: area.gerencias
      .filter((g) => g.desde <= anio)
      .map((gerencia) => ({
        id: gerencia.id,
        tipo: 'gerencia',
        nombre: gerencia.nombre,
        estado: estadoEn(anio, gerencia.hasta),
        equipos: gerencia.equipos
          .filter((e) => e.desde <= anio)
          .map((equipo) => ({
            id: equipo.id,
            tipo: 'equipo',
            nombre: equipo.nombre,
            estado: estadoEn(anio, equipo.hasta),
            miembros: equipo.miembros
              .filter((m) => m.desde <= anio)
              .map((m) => ({ id: `${equipo.id}__${m.email}`, nombre: m.nombre, email: m.email, rol: m.rol })),
          })),
      })),
  }))
}

export interface EstructuraCounts {
  gerencias: number
  equipos: number
  miembros: number
}

export function contarEstructura(areas: AreaNodo[]): EstructuraCounts {
  const gerencias = areas.flatMap((a) => a.gerencias)
  const equipos = gerencias.flatMap((g) => g.equipos)
  const miembros = equipos.flatMap((e) => e.miembros)
  return { gerencias: gerencias.length, equipos: equipos.length, miembros: miembros.length }
}

/** Ids de equipo bajo un nodo (área, gerencia o el propio equipo) dentro de la estructura de un año
 * dado — unidad real sobre la que se asigna un alcance en "Alcances y permisos"; asignar un
 * área/gerencia es solo un atajo para asignar todos sus equipos vigentes ese año de una vez. */
export function equipoIdsBajoNodo(areas: AreaNodo[], nodoId: string): string[] {
  for (const area of areas) {
    if (area.id === nodoId) return area.gerencias.flatMap((g) => g.equipos.map((e) => e.id))
    for (const gerencia of area.gerencias) {
      if (gerencia.id === nodoId) return gerencia.equipos.map((e) => e.id)
      if (gerencia.equipos.some((e) => e.id === nodoId)) return [nodoId]
    }
  }
  return []
}

export interface EquipoConContexto extends EquipoNodo {
  gerenciaNombre: string
  areaNombre: string
}

/** Todos los equipos de la estructura con su gerencia/área de contexto — fuente de las tarjetas del
 * panel "Permisos asignados". */
export function todosLosEquipos(areas: AreaNodo[]): EquipoConContexto[] {
  return areas.flatMap((area) => area.gerencias.flatMap((gerencia) => gerencia.equipos.map((equipo) => ({ ...equipo, gerenciaNombre: gerencia.nombre, areaNombre: area.nombre }))))
}
