import { v3Lineas, V3_NEGOCIOS, V3_RESPONSABLES, type V3Linea, type V3Pais } from '@/data/gasto-it-v3'
import type { VistaMoneda } from './moneda'

/** Dos visiones del mismo reporte: Tecnología (consolidado por país, negocio y gerencia) y Negocio (gasto IT
 * asignado a los negocios y su peso sobre la venta). La visión define el perímetro, las aperturas
 * disponibles y la moneda por defecto; el país seleccionado acota todo lo que se muestra. */
/** 'gestion' = Gestión del gasto: forecast en edición y preliminares en destino (antes del cierre). */
export type Rol = 'corporativo' | 'negocio' | 'gestion'

export const ROLES: { value: Rol; label: string; descripcion: string }[] = [
  { value: 'corporativo', label: 'Visión Tecnología', descripcion: 'Gasto IT consolidado por país, negocio y gerencia' },
  { value: 'negocio', label: 'Visión Negocio', descripcion: 'Gasto IT de los negocios y su peso sobre la venta' },
  { value: 'gestion', label: 'Gestión del gasto', descripcion: 'Forecast en edición y preliminares, en destino' },
]

/** Banderas (negocios) que opera Cencosud; un negocio-país es bandera + país. */
export const MARCAS = [...new Set(V3_NEGOCIOS.map((n) => n.negocio))].sort((a, b) => a.localeCompare(b, 'es'))
export const marcasDelPais = (pais: V3Pais | 'todos') =>
  pais === 'todos' ? MARCAS : V3_NEGOCIOS.filter((n) => n.pais === pais).map((n) => n.negocio)

export interface Alcance {
  rol: Rol
  pais: V3Pais | 'todos'
  /** Bandera de la Visión Negocio ('todas' = todos los negocios). */
  marca: string
  /** Se conserva para compatibilidad de URLs antiguas; ya no hay vista de gestor. */
  gestor: string
}

export const ALCANCE_DEFAULT: Record<Rol, Omit<Alcance, 'rol'>> = {
  corporativo: { pais: 'todos', marca: 'todas', gestor: V3_RESPONSABLES[0] },
  negocio: { pais: 'todos', marca: 'todas', gestor: V3_RESPONSABLES[0] },
  gestion: { pais: 'todos', marca: 'todas', gestor: V3_RESPONSABLES[0] },
}

export function enAlcance(a: Alcance, l: V3Linea): boolean {
  if (a.pais !== 'todos' && l.pais !== a.pais) return false
  return true
}

export const lineasDelAlcance = (a: Alcance) => v3Lineas.filter((l) => enAlcance(a, l))

export function alcanceLabel(a: Alcance): string {
  const pais = a.pais === 'todos' ? 'todos los países' : a.pais
  if (a.rol === 'negocio') return `Todos los negocios · ${pais}`
  if (a.rol === 'gestion') return `Gestión del gasto · ${pais}`
  return `Cencosud consolidado · ${pais}`
}

export type BloqueId = 'rubros' | 'paises' | 'evolutivo' | 'tablas' | 'mapa' | 'resumen' | 'detalle' | 'focos'

export interface RolConfig {
  monedaVista: VistaMoneda
  /** Bloques desplegados por defecto (el resto queda colapsado, nunca oculto). */
  abiertos: BloqueId[]
  /** Rubros en lenguaje de negocio, con los técnicos agrupados. */
  rubrosNegocio: boolean
  /** Apertura del "Resumen" (sección C). */
  resumen: 'pais' | 'rubro'
  /** Origen ML no aplica a la Visión Negocio (solo Destino USD o Destino ML). */
  conOrigen: boolean
}

export const ROL_CONFIG: Record<Rol, RolConfig> = {
  corporativo: { monedaVista: 'usd', abiertos: ['rubros', 'paises', 'evolutivo', 'tablas', 'detalle'], rubrosNegocio: false, resumen: 'pais', conOrigen: true },
  negocio: { monedaVista: 'usd', abiertos: ['rubros', 'paises', 'evolutivo', 'tablas', 'mapa', 'detalle'], rubrosNegocio: true, resumen: 'rubro', conOrigen: false },
  gestion: { monedaVista: 'usd', abiertos: [], rubrosNegocio: false, resumen: 'pais', conOrigen: false },
}
