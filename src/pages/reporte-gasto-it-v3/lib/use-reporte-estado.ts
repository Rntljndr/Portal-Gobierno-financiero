import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { V3_PAISES, V3_RESPONSABLES, type V3Pais } from '@/data/gasto-it-v3'
import type { Ajustes } from './contexto'
import { monedaLocalDisponible, type VistaMoneda } from './moneda'
import { ALCANCE_DEFAULT, MARCAS, ROL_CONFIG, ROLES, type Alcance, type Rol } from './perimetro'
import type { DimId } from './pivot'
import { VISTAS_PREDEFINIDAS, type DetalleEstado } from './vistas'
import { TOLERANCIA_DEFAULT } from './estado'
import { PERIODO_DEFAULT, type GrupoRubro, type Periodo } from './medida'

const VISTA_POR_ROL: Record<Rol, string> = {
  corporativo: 'País',
  negocio: 'Negocio / Bandera',
  gestion: 'País',
}

function detalleInicial(rol: Rol): DetalleEstado {
  const v = VISTAS_PREDEFINIDAS.find((x) => x.nombre === VISTA_POR_ROL[rol])!
  return { filtros: {}, vista: v.nombre, aperturas: v.aperturas, metricas: v.metricas }
}

/** Siguiente nivel de la navegación progresiva: consolidado → país → negocio/gerencia → rubro → cuenta/servicio. */
const SIGUIENTE: [DimId, string[]][] = [
  ['servicio', ['negocio']],
  ['cuentaContable', ['servicio']],
  ['rubro', ['cuentaContable', 'servicio']],
  ['equipo', ['rubro', 'servicio']],
  ['gerencia', ['gerenciaEquipo', 'rubro']],
  ['negocio', ['rubro', 'servicio']],
  ['division', ['negocio', 'rubro']],
  ['pais', ['negocio', 'rubro']],
]

/** Lee el alcance de la URL (compartible) con los defaults de cada vista. */
function leerAlcance(params: URLSearchParams): Alcance {
  const v = params.get('vista') as Rol | null
  const rol: Rol = v && ROLES.some((r) => r.value === v) ? v : 'corporativo'
  const d = ALCANCE_DEFAULT[rol]
  const p = params.get('pais')
  const m = params.get('marca')
  const g = params.get('gestor')
  return {
    rol,
    pais: p === 'todos' || V3_PAISES.includes(p as V3Pais) ? (p as V3Pais | 'todos') : d.pais,
    marca: m && (m === 'todas' || MARCAS.includes(m)) ? m : d.marca,
    gestor: g && V3_RESPONSABLES.includes(g) ? g : d.gestor,
  }
}

/** Estado de la página: alcance en la URL, más moneda, ajustes y detalle. */
export function useReporteEstado() {
  const [params, setParams] = useSearchParams()
  const alcance = leerAlcance(params)
  const [vistaMonedaSel, setVistaMoneda] = useState<VistaMoneda>(ROL_CONFIG[alcance.rol].monedaVista)
  const [ajustes, setAjustes] = useState<Ajustes>({ tolerancia: TOLERANCIA_DEFAULT, pesoParaIT: false, rankingOrden: 'pct' })
  const [detalle, setDetalle] = useState<DetalleEstado>(() => detalleInicial(alcance.rol))
  const [drill, setDrill] = useState(0)
  const [periodo, setPeriodo] = useState<Periodo>(PERIODO_DEFAULT)
  const [grupoRubro, setGrupoRubro] = useState<GrupoRubro | null>(null)
  // Moneda local solo con un país seleccionado: sin moneda común no se puede totalizar.
  // Origen ML no aplica a la Visión Negocio: ahí la moneda local siempre es la de destino.
  const local = monedaLocalDisponible(alcance.pais) ? vistaMonedaSel : 'usd'
  const vistaMoneda: VistaMoneda = !ROL_CONFIG[alcance.rol].conOrigen && local === 'origen' ? 'destino' : local

  const cambiarAlcance = (patch: Partial<Alcance>) => {
    const cambiaRol = patch.rol && patch.rol !== alcance.rol
    const next: Alcance = cambiaRol ? { rol: patch.rol!, ...ALCANCE_DEFAULT[patch.rol!], ...patch } : { ...alcance, ...patch }
    setParams({ vista: next.rol, pais: next.pais, marca: next.marca }, { replace: true })
    if (cambiaRol) {
      setVistaMoneda(ROL_CONFIG[next.rol].monedaVista)
      setDetalle(detalleInicial(next.rol))
      setDrill(0)
      setGrupoRubro(null)
    }
  }

  const profundizar = (ruta: Partial<Record<DimId, string>>) => {
    const dims = Object.keys(ruta) as DimId[]
    const aperturas = SIGUIENTE.find(([d]) => dims.includes(d))?.[1] ?? ['pais', 'negocio']
    const filtros = Object.fromEntries(Object.entries(ruta).map(([d, v]) => [d, [v]]))
    setDetalle((d) => ({ ...d, filtros, aperturas }))
    setDrill((n) => n + 1)
    setTimeout(() => document.getElementById('detalle')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  return { alcance, vistaMoneda, setVistaMoneda, ajustes, setAjustes, detalle, setDetalle, drill, cambiarAlcance, profundizar, periodo, setPeriodo, grupoRubro, setGrupoRubro }
}
