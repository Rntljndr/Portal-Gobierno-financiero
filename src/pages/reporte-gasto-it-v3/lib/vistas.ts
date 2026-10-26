import type { V3Linea } from '@/data/gasto-it-v3'
import { dimValor, METRICAS_HC, type DimId } from './pivot'

export interface Vista {
  nombre: string
  aperturas: string[]
  metricas: string[]
  /** Predefinida = no editable ni eliminable: dos personas que la abren revisan exactamente lo mismo. */
  predefinida?: boolean
}

const BASE = ['plan', 'real', 'desv', 'desvPct', 'ant', 'varPct']
const CON_VENTA = [...BASE, 'pesoVenta', ...METRICAS_HC]

/** Pestañas del detalle (una por dimensión, como el detalle del Reporte Tecnología); las mismas en las dos
 * visiones. Las de país, división, negocio y gerencia incluyen el headcount (HC). */
export const VISTAS_PREDEFINIDAS: Vista[] = [
  { nombre: 'País', aperturas: ['pais', 'negocio', 'rubro'], metricas: CON_VENTA, predefinida: true },
  { nombre: 'División', aperturas: ['division', 'negocio', 'rubro'], metricas: CON_VENTA, predefinida: true },
  { nombre: 'Negocio / Bandera', aperturas: ['negocio', 'rubro', 'servicio'], metricas: CON_VENTA, predefinida: true },
  { nombre: 'Gerencia / Equipo', aperturas: ['gerenciaEquipo', 'servicio'], metricas: [...BASE, ...METRICAS_HC], predefinida: true },
  { nombre: 'Rubro', aperturas: ['rubro', 'servicio', 'negocio'], metricas: [...BASE, 'participacion'], predefinida: true },
  { nombre: 'Cuenta contable', aperturas: ['cuentaContable', 'servicio'], metricas: [...BASE, 'participacion'], predefinida: true },
  { nombre: 'Servicio', aperturas: ['servicio', 'negocio'], metricas: BASE, predefinida: true },
  { nombre: 'Responsable', aperturas: ['responsable', 'servicio'], metricas: BASE, predefinida: true },
]

const KEY = 'gasto-it-v3-vistas'

function leer(): Vista[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Vista[]) : []
  } catch {
    return []
  }
}

function escribir(vs: Vista[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(vs))
  } catch {
    // Sin almacenamiento disponible: la vista dura solo esta sesión.
  }
}

export const listarVistas = (): Vista[] => [...VISTAS_PREDEFINIDAS, ...leer()]

export function guardarVista(v: Vista) {
  if (VISTAS_PREDEFINIDAS.some((p) => p.nombre === v.nombre)) return
  escribir([...leer().filter((x) => x.nombre !== v.nombre), { ...v, predefinida: false }])
}

export const eliminarVista = (nombre: string) => escribir(leer().filter((x) => x.nombre !== nombre))

// ---------------------------------------------------------------------------
// Filtros del detalle (solo afectan a la sección D)
// ---------------------------------------------------------------------------

export type Filtros = Partial<Record<DimId, string[]>>

export const DIMS_FILTRO: DimId[] = ['pais', 'division', 'negocio', 'gerencia', 'equipo', 'rubro', 'cuentaContable', 'servicio', 'responsable']

export const aplicarFiltros = (lineas: V3Linea[], f: Filtros) =>
  lineas.filter((l) => DIMS_FILTRO.every((d) => !f[d]?.length || f[d]!.includes(dimValor(d, l))))

export const contarFiltros = (f: Filtros) => DIMS_FILTRO.reduce((n, d) => n + (f[d]?.length ?? 0), 0)

export const opcionesDe = (lineas: V3Linea[], d: DimId) => [...new Set(lineas.map((l) => dimValor(d, l)))].sort((a, b) => a.localeCompare(b, 'es'))

/** Estado del detalle del gasto (vista activa + filtros + aperturas + métricas). */
export interface DetalleEstado {
  filtros: Filtros
  vista: string
  aperturas: string[]
  metricas: string[]
}
