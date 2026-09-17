import type { Servicio } from './types'
import { paises } from './paises'

function uniqSorted(values: string[]): string[] {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'))
}

export function buildFiltroOpciones(servicios: Servicio[]) {
  return {
    origen: ['Recurrente', 'Nuevo'],
    pais: paises as string[],
    rubro: uniqSorted(servicios.map((s) => s.rubro)),
    division: uniqSorted(servicios.map((s) => s.division)),
    codigo: uniqSorted(servicios.map((s) => s.codigo)),
    pep: uniqSorted(servicios.map((s) => s.pep)),
    gerenciaPadre: uniqSorted(servicios.map((s) => s.gerenciaPadre)),
    gerencia: uniqSorted(servicios.map((s) => s.gerencia)),
    equipo: uniqSorted(servicios.map((s) => s.equipo)),
    nombre: uniqSorted(servicios.map((s) => s.nombre)),
    bandera: uniqSorted(servicios.map((s) => s.bandera)),
    cuentaContable: uniqSorted(servicios.map((s) => s.cuentaContable)),
  }
}

/** Cascada división → banderas presentes en esa división, para acotar el selector de Bandera según la División elegida. */
export function buildBanderasByDivision(servicios: Servicio[]): Record<string, string[]> {
  const map: Record<string, Set<string>> = {}
  for (const s of servicios) {
    map[s.division] ??= new Set()
    map[s.division].add(s.bandera)
  }
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, uniqSorted([...v])]))
}
