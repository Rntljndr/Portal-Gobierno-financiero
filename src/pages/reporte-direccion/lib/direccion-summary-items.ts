import { countryFlags } from '@/data/reporteria'
import type { DireccionLeaf, DireccionPais } from '@/data/reporte-direccion'

/** Nivel de apertura del resumen: `null` = países; con `pais` = divisiones de ese país; con
 * `division` también = banderas de esa división. Sin nivel de "bandera" propio porque es la hoja. */
export interface DrillState {
  pais: string
  division?: string
}

export interface SummaryItem {
  key: string
  nombre: string
  flag?: string
  levelBadge?: string
  node: DireccionLeaf
  activo: boolean
  /** Presente solo cuando el nodo tiene un nivel siguiente para abrir. */
  onClick?: () => void
}

/** Tarjetas a mostrar según el nivel de apertura actual — país, división de un país, o bandera de
 * una división —, con el `onClick` que baja un nivel ya resuelto (o ausente en las hojas). */
export function buildSummaryItems(
  tree: DireccionPais[],
  drill: DrillState | null,
  paisesActivos: string[] | null,
  setDrill: (d: DrillState | null) => void,
): SummaryItem[] {
  if (!drill) {
    return tree.map((pais) => {
      const activo = (paisesActivos === null || paisesActivos.includes(pais.nombre)) && pais.divisiones.length > 0
      return {
        key: pais.nombre,
        nombre: pais.nombre,
        flag: countryFlags[pais.nombre],
        node: pais,
        activo,
        onClick: activo ? () => setDrill({ pais: pais.nombre }) : undefined,
      }
    })
  }

  const pais = tree.find((p) => p.nombre === drill.pais)
  if (!pais) return []

  if (!drill.division) {
    return pais.divisiones.map((division) => ({
      key: division.nombre,
      nombre: division.nombre,
      levelBadge: 'DIVISIÓN',
      node: division,
      activo: division.banderas.length > 0,
      onClick: division.banderas.length > 0 ? () => setDrill({ pais: drill.pais, division: division.nombre }) : undefined,
    }))
  }

  const division = pais.divisiones.find((d) => d.nombre === drill.division)
  if (!division) return []

  return division.banderas.map((bandera) => ({
    key: bandera.nombre,
    nombre: bandera.nombre,
    levelBadge: 'BANDERA',
    node: bandera,
    activo: true,
  }))
}

/** Denominador de "% de participación en ingresos" para el nivel de apertura actual — confirmado
 * con negocio: a nivel País siempre se compara contra los 7 países (sin importar filtros de país),
 * y al bajar a División/Bandera se recalcula contra el total de su padre inmediato. */
export function summaryDenominadores(tree: DireccionPais[], drill: DrillState | null): { real: number; plan: number } {
  if (!drill) {
    return tree.reduce((acc, p) => ({ real: acc.real + p.ingresosReal, plan: acc.plan + p.ingresosPlan }), { real: 0, plan: 0 })
  }
  const pais = tree.find((p) => p.nombre === drill.pais)
  if (!pais) return { real: 0, plan: 0 }
  if (!drill.division) return { real: pais.ingresosReal, plan: pais.ingresosPlan }
  const division = pais.divisiones.find((d) => d.nombre === drill.division)
  return division ? { real: division.ingresosReal, plan: division.ingresosPlan } : { real: 0, plan: 0 }
}

export function summaryTitulo(drill: DrillState | null): { titulo: string; subtitulo: string } {
  if (!drill) return { titulo: 'Resumen por país', subtitulo: 'Total Real, Plan y participación sobre ingresos por país' }
  if (!drill.division) {
    return { titulo: `Divisiones — ${drill.pais}`, subtitulo: `Participación de cada división sobre los ingresos de ${drill.pais}` }
  }
  return { titulo: `Banderas — ${drill.division}`, subtitulo: `Participación de cada bandera sobre los ingresos de ${drill.division}` }
}
