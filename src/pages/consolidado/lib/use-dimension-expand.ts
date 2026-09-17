import { useState } from 'react'

export function useDimensionExpand() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const onToggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  const reset = () => setExpanded({})
  const expandAll = (keys: string[]) => setExpanded(Object.fromEntries(keys.map((k) => [k, true])))

  return { expanded, onToggle, reset, expandAll }
}
