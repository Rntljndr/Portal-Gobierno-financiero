import { useState } from 'react'

/** `initial`: filas que el reporte Power BI muestra ya desplegadas al cargar (verificado en vivo — no
 * es un estado colapsado por defecto, calza con lo que se ve al abrir el reporte real). */
export function useOpexExpand(initial: string[] = []) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(initial))

  return {
    isOpen: (key: string) => expanded.has(key),
    toggle: (key: string) =>
      setExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      }),
  }
}
