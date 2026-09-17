import { useState } from 'react'

export function useDireccionExpand() {
  const [expandedPais, setExpandedPais] = useState<Record<string, boolean>>({})
  const [expandedDivision, setExpandedDivision] = useState<Record<string, boolean>>({})

  const onTogglePais = (pais: string) => setExpandedPais((prev) => ({ ...prev, [pais]: !prev[pais] }))
  const onToggleDivision = (key: string) => setExpandedDivision((prev) => ({ ...prev, [key]: !prev[key] }))

  return { expandedPais, onTogglePais, expandedDivision, onToggleDivision }
}
