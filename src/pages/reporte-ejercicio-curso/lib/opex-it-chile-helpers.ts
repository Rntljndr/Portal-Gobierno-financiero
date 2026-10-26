import { opexResponsable, opexDivision, type Rubro } from '@/data/opex-it-chile'
import { opexResponsablePorDivision } from '@/data/opex-it-chile-cruces'

export interface OpexFiltros {
  servicio: string
  responsable: string[]
  rubro: Rubro[]
  division: string[]
  cuentaContable: string[]
}

export const OPEX_FILTROS_VACIOS: OpexFiltros = {
  servicio: '',
  responsable: [],
  rubro: [],
  division: [],
  cuentaContable: [],
}

export function variacion(proy: number, plan: number): number {
  return proy - plan
}

/** % de variación sobre el valor absoluto del plan — mismo criterio que el resto del portal
 * (positivo = sobre-ejecución/rojo, negativo = ahorro/verde), sin el quiebre de signo que muestra
 * Power BI cuando el plan es negativo (una cuenta contable "contra", p. ej. Eficiencia). */
export function pctVariacion(proy: number, plan: number): number | null {
  if (plan === 0) return null
  return ((proy - plan) / Math.abs(plan)) * 100
}

export const RESPONSABLE_OPTIONS = opexResponsable.map((r) => r.nombre)
export const DIVISION_OPTIONS = opexDivision.map((d) => d.nombre)
export const CUENTA_CONTABLE_OPTIONS = Array.from(
  new Set(opexResponsable.flatMap((r) => r.children?.map((c) => c.cuentaContable) ?? [])),
)
export const RUBRO_OPTIONS: Rubro[] = ['Servicios', 'Nómina']

/** Suma los montos de un Rubro específico, o el total si no hay rubros seleccionados (= "Todas"). */
export function montoPorRubro(porRubro: Record<Rubro, { proy: number; plan: number }> | undefined, total: { proy: number; plan: number }, rubrosActivos: Rubro[]) {
  if (rubrosActivos.length === 0) return total
  if (!porRubro) return { proy: 0, plan: 0 }
  return rubrosActivos.reduce(
    (acc, r) => ({ proy: acc.proy + porRubro[r].proy, plan: acc.plan + porRubro[r].plan }),
    { proy: 0, plan: 0 },
  )
}

/** Monto de una división para un conjunto de responsables seleccionados (cruce real Responsable ×
 * División, ver `opexResponsablePorDivision`). Si no hay responsables seleccionados, retorna `total`. */
export function montoDivisionPorResponsable(division: string, total: { proy: number; plan: number }, responsablesActivos: string[]) {
  if (responsablesActivos.length === 0) return total
  return opexResponsablePorDivision
    .filter((c) => c.division === division && responsablesActivos.includes(c.responsable))
    .reduce((acc, c) => ({ proy: acc.proy + c.proy, plan: acc.plan + c.plan }), { proy: 0, plan: 0 })
}

/** Monto de un responsable para un conjunto de divisiones seleccionadas — misma idea, en el otro
 * sentido. Si no hay divisiones seleccionadas, retorna `total`. */
export function montoResponsablePorDivision(responsable: string, total: { proy: number; plan: number }, divisionesActivas: string[]) {
  if (divisionesActivas.length === 0) return total
  return opexResponsablePorDivision
    .filter((c) => c.responsable === responsable && divisionesActivas.includes(c.division))
    .reduce((acc, c) => ({ proy: acc.proy + c.proy, plan: acc.plan + c.plan }), { proy: 0, plan: 0 })
}
