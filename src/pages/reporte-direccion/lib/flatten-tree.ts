import type { DireccionPais, DireccionDivision, DireccionLeaf } from '@/data/reporte-direccion'

export interface DireccionFlatRow {
  key: string
  type: 'pais' | 'division' | 'bandera'
  depth: number
  node: DireccionLeaf
  hasChildren: boolean
  isOpen: boolean
  onToggle?: () => void
}

interface FlattenArgs {
  tree: DireccionPais[]
  expandedPais: Record<string, boolean>
  onTogglePais: (pais: string) => void
  expandedDivision: Record<string, boolean>
  onToggleDivision: (key: string) => void
}

export function flattenDireccionTree({ tree, expandedPais, onTogglePais, expandedDivision, onToggleDivision }: FlattenArgs): DireccionFlatRow[] {
  const rows: DireccionFlatRow[] = []

  for (const pais of tree) {
    const paisOpen = !!expandedPais[pais.nombre]
    rows.push({
      key: pais.nombre,
      type: 'pais',
      depth: 0,
      node: pais,
      hasChildren: pais.divisiones.length > 0,
      isOpen: paisOpen,
      onToggle: () => onTogglePais(pais.nombre),
    })
    if (!paisOpen) continue

    for (const division of pais.divisiones as DireccionDivision[]) {
      const divKey = `${pais.nombre}|${division.nombre}`
      const divOpen = !!expandedDivision[divKey]
      rows.push({
        key: divKey,
        type: 'division',
        depth: 1,
        node: division,
        hasChildren: division.banderas.length > 0,
        isOpen: divOpen,
        onToggle: () => onToggleDivision(divKey),
      })
      if (!divOpen) continue

      for (const bandera of division.banderas) {
        rows.push({
          key: `${divKey}|${bandera.nombre}`,
          type: 'bandera',
          depth: 2,
          node: bandera,
          hasChildren: false,
          isOpen: false,
        })
      }
    }
  }

  return rows
}
