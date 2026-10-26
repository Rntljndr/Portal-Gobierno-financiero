import { divisionDe, type V3Linea } from '@/data/gasto-it-v3'
import { agrupar } from './calc'
import { medir, pesoVenta, type Medida, type Periodo } from './medida'
import { headcount, type Headcount } from './headcount'

/** Dimensiones del detalle del gasto (las del enunciado). Gerencia/Equipo abre en dos niveles. */
export type DimId = 'pais' | 'division' | 'negocio' | 'gerencia' | 'equipo' | 'rubro' | 'cuentaContable' | 'servicio' | 'responsable'

export const DIM_LABEL: Record<DimId, string> = {
  pais: 'País',
  division: 'División',
  negocio: 'Negocio / Bandera',
  gerencia: 'Gerencia',
  equipo: 'Equipo',
  rubro: 'Rubro',
  cuentaContable: 'Cuenta contable',
  servicio: 'Servicio',
  responsable: 'Responsable de cuenta',
}

export const dimValor = (d: DimId, l: V3Linea): string => {
  if (d === 'negocio') return `${l.negocio} ${l.pais}`
  if (d === 'division') return divisionDe(l.negocio)
  return l[d]
}

export interface Apertura {
  id: string
  label: string
  niveles: DimId[]
}

export const APERTURAS: Apertura[] = [
  { id: 'pais', label: 'País', niveles: ['pais'] },
  { id: 'division', label: 'División', niveles: ['division'] },
  { id: 'negocio', label: 'Negocio / Bandera', niveles: ['negocio'] },
  { id: 'gerenciaEquipo', label: 'Gerencia / Equipo', niveles: ['gerencia', 'equipo'] },
  { id: 'rubro', label: 'Rubro', niveles: ['rubro'] },
  { id: 'cuentaContable', label: 'Cuenta contable', niveles: ['cuentaContable'] },
  { id: 'servicio', label: 'Servicio', niveles: ['servicio'] },
  { id: 'responsable', label: 'Responsable de cuenta', niveles: ['responsable'] },
]

export interface Metrica {
  id: string
  label: string
  /** 'hc' = personas (headcount), sin moneda. */
  tipo: 'monto' | 'pct' | 'hc'
  /** true = se colorea con el semáforo (desvío contra plan). */
  semaforo: boolean
  valor: (m: Medida, n: PivotNodo, totalPlan: number) => number
}

/** Columnas del detalle, todas calculadas con el período elegido en las tarjetas (mes, acumulado o proyectado). */
export const METRICAS: Metrica[] = [
  { id: 'plan', label: 'Plan', tipo: 'monto', semaforo: false, valor: (m) => m.plan },
  { id: 'real', label: 'Real', tipo: 'monto', semaforo: false, valor: (m) => m.valor },
  { id: 'desv', label: 'Desvío', tipo: 'monto', semaforo: true, valor: (m) => m.desv },
  { id: 'desvPct', label: 'Desvío %', tipo: 'pct', semaforo: true, valor: (m) => m.desvPct },
  { id: 'ant', label: 'Año anterior', tipo: 'monto', semaforo: false, valor: (m) => m.ant },
  { id: 'varPct', label: 'Variación %', tipo: 'pct', semaforo: false, valor: (m) => m.varPct },
  { id: 'participacion', label: '% participación', tipo: 'pct', semaforo: false, valor: (m, _n, total) => (total > 0 ? (m.plan / total) * 100 : 0) },
  { id: 'pesoVenta', label: '% sobre venta', tipo: 'pct', semaforo: false, valor: (_m, n) => n.pesoVenta },
  { id: 'hcAnt', label: 'HC año ant.', tipo: 'hc', semaforo: false, valor: (_m, n) => n.hc.ant },
  { id: 'hcPlan', label: 'HC plan', tipo: 'hc', semaforo: false, valor: (_m, n) => n.hc.plan },
  { id: 'hcReal', label: 'HC real', tipo: 'hc', semaforo: false, valor: (_m, n) => n.hc.real },
  { id: 'hcForecast', label: 'HC forecast', tipo: 'hc', semaforo: false, valor: (_m, n) => n.hc.forecast },
]

export const METRICAS_HC = ['hcAnt', 'hcPlan', 'hcReal', 'hcForecast']

export interface PivotNodo {
  key: string
  nombre: string
  nivel: DimId
  /** Filtros que identifican al nodo (para el evolutivo y para profundizar). */
  ruta: Partial<Record<DimId, string>>
  lineas: V3Linea[]
  m: Medida
  pesoVenta: number
  hc: Headcount
  hijos: PivotNodo[]
}

export function construirPivot(lineas: V3Linea[], aperturaIds: string[], periodo: Periodo): PivotNodo[] {
  const niveles = aperturaIds.flatMap((id) => APERTURAS.find((a) => a.id === id)?.niveles ?? [])
  function rec(ls: V3Linea[], depth: number, ruta: Partial<Record<DimId, string>>): PivotNodo[] {
    if (depth >= niveles.length) return []
    const dim = niveles[depth]
    return agrupar(ls, (l) => dimValor(dim, l))
      .map((g) => {
        const r = { ...ruta, [dim]: g.key }
        const m = medir(g.lineas, periodo)
        return { key: JSON.stringify(r), nombre: g.key, nivel: dim, ruta: r, lineas: g.lineas, m, pesoVenta: pesoVenta(g.lineas, periodo).real, hc: headcount(g.lineas), hijos: rec(g.lineas, depth + 1, r) }
      })
      .sort((a, b) => b.m.plan - a.m.plan)
  }
  return rec(lineas, 0, {})
}

export function aplanar(nodos: PivotNodo[], abiertos: Set<string>, depth = 0): { nodo: PivotNodo; depth: number }[] {
  return nodos.flatMap((n) => [{ nodo: n, depth }, ...(abiertos.has(n.key) ? aplanar(n.hijos, abiertos, depth + 1) : [])])
}
