import { paisIpc, type Pais } from './services'

export interface DireccionLeaf {
  nombre: string
  real: number
  plan: number
  realAnterior: number
  ingresosReal: number
  ingresosPlan: number
  ingresosAnterior: number
}

export interface DireccionDivision extends DireccionLeaf {
  banderas: DireccionLeaf[]
}

export interface DireccionPais extends DireccionLeaf {
  divisiones: DireccionDivision[]
}

/** Taxonomía propia de Reporte de Dirección — independiente de los fixtures de Servicio que usan
 * Consolidado y Reportería, porque las divisiones/banderas de este reporte ejecutivo son otras. */
export const DIRECCION_PAISES: Pais[] = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Estados Unidos', 'Perú', 'Uruguay']
export const DIRECCION_DIVISIONES = [
  'Corporación',
  'División Clientes',
  'División Corporación',
  'División MDH',
  'División Retail Financiero',
]
export const DIRECCION_RUBROS = ['Amortización', 'Nómina', 'Servicios']

interface BanderaDef {
  nombre: string
  paises: Pais[]
}

/** Cada bandera es propia de su país, salvo "Tiendas Cerradas" — un rubro de cierre que existe en todos. */
const BANDERAS: BanderaDef[] = [
  { nombre: 'Vea ARG', paises: ['Argentina'] },
  { nombre: 'Spid BRA', paises: ['Brasil'] },
  { nombre: 'Sta Isabel CHI', paises: ['Chile'] },
  { nombre: 'Tarjetas COL', paises: ['Colombia'] },
  { nombre: 'Teleticket PER', paises: ['Perú'] },
  { nombre: 'Wong PER', paises: ['Perú'] },
  { nombre: 'Tiendas Cerradas', paises: DIRECCION_PAISES },
]

export const DIRECCION_BANDERAS = BANDERAS.map((b) => b.nombre)

const BASE_PLAN: Record<Pais, number> = {
  Colombia: 1_070_000,
  Brasil: 900_000,
  Argentina: 380_000,
  Chile: 300_000,
  Perú: 260_000,
  'Estados Unidos': 150_000,
  Uruguay: 90_000,
}

/** Hash determinístico (sin librerías) para variar proporciones sin depender de datos reales. */
function hashRatio(seed: string, min: number, max: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return min + ((h % 1000) / 1000) * (max - min)
}

/** Crecimiento A/A acotado: usa el IPC del país como proxy de variación, con techo del 12% para que la comparación siga siendo legible incluso en países de alta inflación (ej. Argentina). */
function yoyFactor(pais: string): number {
  const ipc = paisIpc[pais as keyof typeof paisIpc] ?? 4
  return 1 + Math.min(ipc, 12) / 100
}

function buildLeaf(nombre: string, pais: string, real: number, plan: number): DireccionLeaf {
  const factor = yoyFactor(pais)
  const multiplier = hashRatio(`${pais}|${nombre}`, 5.5, 8.2)
  const ingresosReal = Math.round(real * multiplier)
  return {
    nombre,
    real,
    plan,
    realAnterior: Math.round(real / factor),
    ingresosReal,
    ingresosPlan: Math.round(plan * multiplier),
    ingresosAnterior: Math.round(ingresosReal / factor),
  }
}

function sumLeaves(nombre: string, leaves: DireccionLeaf[]): DireccionLeaf {
  return leaves.reduce(
    (acc, l) => ({
      nombre,
      real: acc.real + l.real,
      plan: acc.plan + l.plan,
      realAnterior: acc.realAnterior + l.realAnterior,
      ingresosReal: acc.ingresosReal + l.ingresosReal,
      ingresosPlan: acc.ingresosPlan + l.ingresosPlan,
      ingresosAnterior: acc.ingresosAnterior + l.ingresosAnterior,
    }),
    { nombre, real: 0, plan: 0, realAnterior: 0, ingresosReal: 0, ingresosPlan: 0, ingresosAnterior: 0 },
  )
}

function buildDivision(pais: Pais, division: string, planDivision: number): DireccionDivision {
  const banderasPais = BANDERAS.filter((b) => b.paises.includes(pais))
  const pesos = banderasPais.map((b) => hashRatio(`${pais}|${division}|${b.nombre}`, 0.5, 1.5))
  const pesoTotal = pesos.reduce((a, b) => a + b, 0)

  const banderas = banderasPais.map((b, i) => {
    const plan = Math.round((planDivision * pesos[i]) / pesoTotal)
    const real = Math.round(plan * hashRatio(`${pais}|${division}|${b.nombre}|real`, 0.9, 1.08))
    return buildLeaf(b.nombre, pais, real, plan)
  })

  return { ...sumLeaves(division, banderas), banderas }
}

function buildPais(pais: Pais): DireccionPais {
  const planTotal = BASE_PLAN[pais]
  const pesos = DIRECCION_DIVISIONES.map((d) => hashRatio(`${pais}|${d}`, 0.6, 1.6))
  const pesoTotal = pesos.reduce((a, b) => a + b, 0)

  const divisiones = DIRECCION_DIVISIONES.map((division, i) => buildDivision(pais, division, Math.round((planTotal * pesos[i]) / pesoTotal)))
  return { ...sumLeaves(pais, divisiones), divisiones }
}

function buildTree(): DireccionPais[] {
  return DIRECCION_PAISES.map(buildPais).sort((a, b) => b.real - a.real)
}

export const direccionTree: DireccionPais[] = buildTree()
export const direccionTotal: DireccionLeaf = sumLeaves('Total Cencosud', direccionTree)
