import { useState } from 'react'

/** Expand de 2 niveles (Gerencia > Equipo) para la tabla drill-down de la sección "Vista Gerencias
 * Cross" — mismo patrón liviano que `useDimensionExpand` de Reportería Consolidada. */
export function useRecoeExpand() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return { expanded, toggle, isOpen: (key: string) => expanded.has(key) }
}
