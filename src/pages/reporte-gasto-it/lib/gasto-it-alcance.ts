import { gitLineas, gitVentas, GIT_NEGOCIOS, GIT_GERENCIAS, GIT_GESTORES, type GitLinea, type GitPais } from '@/data/gasto-it-v2'

// ---------------------------------------------------------------------------
// Perspectivas (audiencias) y alcance de datos
// ---------------------------------------------------------------------------

export type Perspectiva = 'corporativo' | 'negocio' | 'it' | 'gestor'

export const PERSPECTIVAS: { value: Perspectiva; label: string; descripcion: string }[] = [
  { value: 'corporativo', label: 'Tecnología corporativo', descripcion: 'Visión consolidada de todos los países y negocios, comparativos y focos de desviación.' },
  { value: 'negocio', label: 'Gerente de negocio', descripcion: 'Gasto IT que le corresponde a tu negocio y su peso sobre la venta.' },
  { value: 'it', label: 'Gerente IT', descripcion: 'Gasto que administra tu gerencia, su evolución y sus desviaciones.' },
  { value: 'gestor', label: 'Gestor de gasto', descripcion: 'Seguimiento operativo de cada contrato y proveedor que administras.' },
]

/** Clave única de un negocio en un país, ej. "Chile|Jumbo". */
export const negocioKey = (pais: string, negocio: string) => `${pais}|${negocio}`
export const negocioLabel = (key: string) => {
  const [pais, negocio] = key.split('|')
  return `${negocio} ${pais}`
}

export const NEGOCIO_OPCIONES = GIT_NEGOCIOS.map((n) => ({ value: negocioKey(n.pais, n.negocio), label: `${n.negocio} ${n.pais}` }))
export const GERENCIA_OPCIONES = GIT_GERENCIAS.map((g) => ({ value: g, label: g }))
export const GESTOR_OPCIONES = GIT_GESTORES.map((g) => {
  const cats = [...new Set(gitLineas.filter((l) => l.gestor === g).map((l) => l.categoria))]
  return { value: g, label: `${g} — ${cats.join(', ')}` }
})

export interface Alcance {
  perspectiva: Perspectiva
  /** Filtro de país opcional (corporativo y gerente IT); 'todos' = sin filtrar. */
  pais: GitPais | 'todos'
  negocio: string
  gerencia: string
  gestor: string
}

export function lineasDelAlcance(a: Alcance): GitLinea[] {
  return gitLineas.filter((l) => {
    if (a.perspectiva === 'negocio') return negocioKey(l.pais, l.negocio) === a.negocio
    if (a.pais !== 'todos' && l.pais !== a.pais) return false
    if (a.perspectiva === 'it') return l.gerencia === a.gerencia
    if (a.perspectiva === 'gestor') return l.gestor === a.gestor
    return true
  })
}

export function ventasDelAlcance(lineas: GitLinea[]) {
  const keys = new Set(lineas.map((l) => negocioKey(l.pais, l.negocio)))
  return gitVentas.filter((v) => keys.has(negocioKey(v.pais, v.negocio)))
}
