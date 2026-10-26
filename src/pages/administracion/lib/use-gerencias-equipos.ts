import { useMemo, useState } from 'react'
import {
  contarEstructura,
  estructuraParaAnio,
  GERENCIAS_EQUIPOS_ANIOS,
  type AreaNodo,
  type EstadoOrganizacional,
  type GerenciaNodo,
} from '@/data/gerencias-equipos'

export type EstadoFiltro = 'todos' | EstadoOrganizacional

function filtrarEstado(areas: AreaNodo[], filtro: EstadoFiltro): AreaNodo[] {
  if (filtro === 'todos') return areas
  return areas
    .map((area) => {
      const gerencias = area.gerencias
        .map((ger) => {
          const equipos = ger.equipos.filter((e) => e.estado === filtro)
          if (ger.estado !== filtro && equipos.length === 0) return null
          return { ...ger, equipos }
        })
        .filter((g): g is GerenciaNodo => !!g)
      if (area.estado !== filtro && gerencias.length === 0) return null
      return { ...area, gerencias }
    })
    .filter((a): a is AreaNodo => !!a)
}

function filtrarBusqueda(areas: AreaNodo[], query: string): AreaNodo[] {
  const q = query.trim().toLowerCase()
  if (!q) return areas
  const matches = (nombre: string) => nombre.toLowerCase().includes(q)
  return areas
    .map((area) => {
      const gerencias = area.gerencias
        .map((ger) => {
          const equipos = ger.equipos.filter((e) => matches(e.nombre))
          if (!matches(ger.nombre) && equipos.length === 0) return null
          return { ...ger, equipos: matches(ger.nombre) ? ger.equipos : equipos }
        })
        .filter((g): g is GerenciaNodo => !!g)
      if (!matches(area.nombre) && gerencias.length === 0) return null
      return { ...area, gerencias: matches(area.nombre) ? area.gerencias : gerencias }
    })
    .filter((a): a is AreaNodo => !!a)
}

function idsExpandibles(areas: AreaNodo[]): string[] {
  return areas.flatMap((area) => [area.id, ...area.gerencias.map((g) => g.id)])
}

/** Estado de la pantalla "Gerencias y Equipos" (F: copiada de Administración > Gerencia y equipo, con
 * selector de Ejercicio como en Tasas Hyperion) — cambiar el año reconstruye toda la estructura vigente
 * ese año (ver `estructuraParaAnio`), sin pedir nada al servidor (todo vive en el seed del módulo). */
export function useGerenciasEquipos() {
  const [anio, setAnio] = useState(GERENCIAS_EQUIPOS_ANIOS[0])
  const [search, setSearch] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>('todos')
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())

  const estructuraCompleta = useMemo(() => estructuraParaAnio(anio), [anio])
  const counts = useMemo(() => contarEstructura(estructuraCompleta), [estructuraCompleta])

  const estructura = useMemo(() => {
    const porEstado = filtrarEstado(estructuraCompleta, estadoFiltro)
    return filtrarBusqueda(porEstado, search)
  }, [estructuraCompleta, estadoFiltro, search])

  const expandidosEfectivos = useMemo(() => {
    if (!search.trim()) return expandidos
    return new Set([...expandidos, ...idsExpandibles(estructura)])
  }, [expandidos, estructura, search])

  const toggleExpand = (id: string) =>
    setExpandidos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return {
    anio,
    setAnio,
    anios: GERENCIAS_EQUIPOS_ANIOS,
    search,
    setSearch,
    estadoFiltro,
    setEstadoFiltro,
    estructura,
    counts,
    expandidos: expandidosEfectivos,
    toggleExpand,
  }
}
