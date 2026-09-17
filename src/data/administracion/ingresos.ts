import { monthKeys } from '@/data/reporteria'
import { BANDERAS_MAESTRO } from './ingresos-banderas'

export const EJERCICIOS_INGRESOS = [2026, 2027]

export type MesesIngreso = Record<string, number>

export interface IngresoBandera {
  /** Nombre exacto de la bandera — FK a `BanderaMaestro.nombre`. */
  bandera: string
  ejercicio: number
  meses: MesesIngreso
}

function buildMeses(valor: number): MesesIngreso {
  return Object.fromEntries(monthKeys.map((k) => [k, valor]))
}

/** Monto mensual plano por bandera para 2027, tal como aparece en la imagen validada (un solo valor
 * repetido en los 12 meses — el mock de la reunión no distinguía estacionalidad). */
const VALORES_2027: Record<string, number> = {
  'Argentina-Aventura': 13.11,
  'Argentina-Mdh-Blaisten Ecommerce': 284817.73,
  'Argentina-Retail Financiero': 360012032.31,
  'Argentina-Sm-Spid35': 1726523.31,
  'Argentina-Sm- Disco Ecommerce': 11084914.21,
  'Argentina-Mdh-Blaisten': 148159476.12,
  'Argentina-Mdh-Easy Ecommerce': 61603763.99,
  'Argentina-Mdh-Easy': 1951049601.72,
  'Argentina-Clientes-Cenco Media': 38777195.65,
  'Argentina-Corporación': 3895832.01,
}

/** Hash determinístico para las banderas agregadas fuera de la imagen (países más allá de Argentina):
 * sin dato de referencia, se genera un monto plausible y estable en vez de dejarlas en 0. */
function hashRatio(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return (h % 1000) / 1000
}

function valorProvisorio2027(nombre: string): number {
  const conocido = VALORES_2027[nombre]
  if (conocido != null) return conocido
  return Math.round((10_000 + hashRatio(nombre) * 400_000_000) * 100) / 100
}

/** PROVISORIO — 2026 no tiene dato real de referencia; se deriva de 2027 con un factor fijo solo para
 * que el selector de Ejercicio tenga algo que mostrar en ambos años. Reemplazar cuando haya datos reales. */
function buildSeed(): IngresoBandera[] {
  return BANDERAS_MAESTRO.flatMap((b) => {
    const v2027 = valorProvisorio2027(b.nombre)
    const v2026 = Math.round((v2027 / 1.05) * 100) / 100
    return [
      { bandera: b.nombre, ejercicio: 2027, meses: buildMeses(v2027) },
      { bandera: b.nombre, ejercicio: 2026, meses: buildMeses(v2026) },
    ]
  })
}

export const INGRESOS_SEED: IngresoBandera[] = buildSeed()
