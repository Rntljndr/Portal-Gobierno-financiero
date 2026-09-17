import { getDestinos, origenServicioDe, type Servicio } from '@/data/services'
import type { ConsolidadaFilters } from './use-consolidada-filters'

function matchesMulti(values: string[], value: string): boolean {
  return values.length === 0 || values.includes(value)
}

/** El filtro "Mes" no acota resultados: el mock no tiene granularidad mensual por servicio (solo totales
 * anuales), igual que otros filtros "de completitud" ya existentes en Reportería (ver filter-catalog.ts). */
export function filterServicios(servicios: Servicio[], filters: ConsolidadaFilters): Servicio[] {
  const buscar = filters.buscar.trim().toLowerCase()

  return servicios.filter((s) => {
    if (buscar && !`${s.nombre} ${s.codigo} ${s.pep}`.toLowerCase().includes(buscar)) return false
    if (!matchesMulti(filters.gerenciaPadre, s.gerenciaPadre)) return false
    if (!matchesMulti(filters.gerencia, s.gerencia)) return false
    if (!matchesMulti(filters.equipo, s.equipo)) return false
    if (!matchesMulti(filters.paisOrigen, s.pais)) return false
    if (!matchesMulti(filters.division, s.division)) return false
    if (!matchesMulti(filters.bandera, s.bandera)) return false
    if (!matchesMulti(filters.rubro, s.rubro)) return false
    if (!matchesMulti(filters.cuentaContable, s.cuentaContable)) return false
    if (!matchesMulti(filters.origenServicio, origenServicioDe(s))) return false
    if (filters.paisDestino.length > 0 && !getDestinos(s).some((d) => filters.paisDestino.includes(d.pais))) return false
    return true
  })
}
