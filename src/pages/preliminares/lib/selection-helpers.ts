export function toggleInSet(set: Set<string>, codigo: string): Set<string> {
  const next = new Set(set)
  if (next.has(codigo)) next.delete(codigo)
  else next.add(codigo)
  return next
}

export function toggleGroupInSet(set: Set<string>, codigos: string[]): Set<string> {
  const allSelected = codigos.length > 0 && codigos.every((c) => set.has(c))
  const next = new Set(set)
  codigos.forEach((c) => {
    if (allSelected) next.delete(c)
    else next.add(c)
  })
  return next
}

interface SelectableRow {
  codigo: string
  estado: 'preliminar' | 'definitivo'
}

interface SelectableN4Row {
  children: SelectableRow[]
}

export function allSelectable(isN7: boolean, filteredN4: SelectableN4Row[], n7Flat: SelectableRow[]): string[] {
  if (isN7) return n7Flat.filter((c) => c.estado === 'preliminar').map((c) => c.codigo)
  return filteredN4.flatMap((n4) => n4.children.filter((c) => c.estado === 'preliminar').map((c) => c.codigo))
}
