import type { PreliminarN4Row } from '@/data/preliminares'

export function n4RowSelectState(n4: PreliminarN4Row, selected: Set<string>) {
  const selectable = n4.children.filter((c) => c.estado === 'preliminar')
  const checked = selectable.length > 0 && selectable.every((c) => selected.has(c.codigo))
  const some = selectable.some((c) => selected.has(c.codigo))
  return { checked, indeterminate: some && !checked, disabled: selectable.length === 0 }
}
