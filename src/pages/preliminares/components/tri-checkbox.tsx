import { useEffect, useRef } from 'react'

interface TriCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange: () => void
}

export function TriCheckbox({ checked, indeterminate, disabled, onChange }: TriCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked
  }, [indeterminate, checked])

  return <input ref={ref} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="size-4 accent-primary disabled:opacity-30" />
}
