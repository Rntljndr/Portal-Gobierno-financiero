import { getDestinos, type Servicio } from '@/data/services'
import { tipoGastoDe } from './dimensiones'
import type { ConsolidadoFilters } from './use-consolidado-filters'

function matchesMulti(values: string[], value: string): boolean {
  return values.length === 0 || values.includes(value)
}

export function filterServicios(servicios: Servicio[], filters: ConsolidadoFilters): Servicio[] {
  const buscar = filters.buscar.trim().toLowerCase()

  return servicios.filter((s) => {
    if (buscar && !`${s.nombre} ${s.codigo} ${s.pep} ${s.cuentaContable}`.toLowerCase().includes(buscar)) return false
    if (!matchesMulti(filters.gerenciaPadre, s.gerenciaPadre)) return false
    if (!matchesMulti(filters.gerencia, s.gerencia)) return false
    if (!matchesMulti(filters.equipo, s.equipo)) return false
    if (!matchesMulti(filters.paisOrigen, s.pais)) return false
    if (!matchesMulti(filters.division, s.division)) return false
    if (!matchesMulti(filters.bandera, s.bandera)) return false
    if (!matchesMulti(filters.rubro, s.rubro)) return false
    if (!matchesMulti(filters.cuentaContable, s.cuentaContable)) return false
    if (!matchesMulti(filters.tipoGasto, tipoGastoDe(s))) return false
    if (filters.paisDestino.length > 0 && !getDestinos(s).some((d) => filters.paisDestino.includes(d.pais))) return false
    return true
  })
}
