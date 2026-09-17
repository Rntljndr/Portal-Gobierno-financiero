import { useState } from 'react'

export function useDimensionExpand() {
  const [expandedL1, setExpandedL1] = useState<Record<string, boolean>>({})
  const [expandedL2, setExpandedL2] = useState<Record<string, boolean>>({})

  const onToggleL1 = (key: string) => setExpandedL1((prev) => ({ ...prev, [key]: !prev[key] }))
  const onToggleL2 = (key: string) => setExpandedL2((prev) => ({ ...prev, [key]: !prev[key] }))

  const reset = () => {
    setExpandedL1({})
    setExpandedL2({})
  }

  return { expandedL1, onToggleL1, expandedL2, onToggleL2, reset }
}
