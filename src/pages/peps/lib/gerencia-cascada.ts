import type { AreaNodo } from '@/data/gerencias-equipos'

export interface GerenciaSeleccion {
  gerenciaPadre: string
  gerencia: string
  equipo: string
}

export const GERENCIA_SELECCION_VACIA: GerenciaSeleccion = { gerenciaPadre: '', gerencia: '', equipo: '' }

export interface GerenciaCascada {
  gerenciaPadreOpciones: { value: string; label: string }[]
  gerenciaOpciones: { value: string; label: string }[]
  equipoOpciones: { value: string; label: string }[]
}

/** Resuelve las 3 listas de opciones (Gerencia Padre > Gerencia > Equipo) para una selección dentro de
 * la estructura vigente de un año — misma cascada que "Gerencias y Equipos", reutilizada acá porque
 * "Crear PEP N4" necesita una por cada ejercicio en el que vaya a quedar habilitado el PEP. */
export function cascadaGerencia(estructura: AreaNodo[], seleccion: GerenciaSeleccion): GerenciaCascada {
  const gerenciaPadreOpciones = estructura.map((a) => ({ value: a.id, label: a.nombre }))
  const areaSel = estructura.find((a) => a.id === seleccion.gerenciaPadre)
  const gerenciaOpciones = areaSel?.gerencias.map((g) => ({ value: g.id, label: g.nombre })) ?? []
  const gerenciaSel = areaSel?.gerencias.find((g) => g.id === seleccion.gerencia)
  const equipoOpciones = gerenciaSel?.equipos.map((e) => ({ value: e.id, label: e.nombre })) ?? []
  return { gerenciaPadreOpciones, gerenciaOpciones, equipoOpciones }
}

export function gerenciaSeleccionCompleta(s: GerenciaSeleccion): boolean {
  return !!(s.gerenciaPadre && s.gerencia && s.equipo)
}
