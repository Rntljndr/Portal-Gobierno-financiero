import { direccionTree, type DireccionPais, type DireccionDivision, type DireccionLeaf } from '@/data/reporte-direccion'
import { TODAS, type DireccionFilters } from './use-direccion-filters'

export function sumLeaves(nombre: string, leaves: DireccionLeaf[]): DireccionLeaf {
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

function mapPais(p: DireccionPais, filters: DireccionFilters): DireccionPais {
  const divisiones: DireccionDivision[] = p.divisiones
    .filter((d) => filters.division === TODAS || d.nombre === filters.division)
    .map((d) => {
      const banderas = d.banderas.filter((b) => filters.bandera === TODAS || b.nombre === filters.bandera)
      return { ...sumLeaves(d.nombre, banderas), banderas }
    })
    .filter((d) => d.banderas.length > 0)
  return { ...sumLeaves(p.nombre, divisiones), divisiones }
}

/** División y Bandera acotan por nombre; País acota el nivel raíz y admite varios a la vez (arreglo
 * vacío = todos). Rubro no tiene dimensión propia en el árbol (igual que otros filtros "de
 * completitud" del panel de Reportería) y no filtra acá. */
export function filterDireccionTree(filters: DireccionFilters): DireccionPais[] {
  return direccionTree
    .filter((p) => filters.pais.length === 0 || filters.pais.includes(p.nombre))
    .map((p) => mapPais(p, filters))
    .filter((p) => p.divisiones.length > 0)
}

/** Igual que `filterDireccionTree` pero sin acotar por país y sin descartar países sin líneas —
 * el resumen por país siempre debe mostrar las 7 cards, aunque el resto de los filtros (división,
 * bandera) dejen a alguno sin datos: esa card se distingue por `divisiones.length === 0`, no por
 * desaparecer. */
export function buildCountrySummaryTree(filters: DireccionFilters): DireccionPais[] {
  return direccionTree.map((p) => mapPais(p, filters))
}
