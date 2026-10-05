import { useEffect, useRef } from 'react'

interface TriCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange: () => void
  ariaLabel?: string
}

/** Checkbox con soporte de estado indeterminado (M7) — la propiedad `indeterminate` no existe como
 * atributo HTML, solo como propiedad del elemento DOM, de ahí el ref+effect. Mismo patrón que
 * TriCheckbox en Preliminares, reimplementado acá porque pages/<A> nunca importa de pages/<B>. */
export function TriCheckbox({ checked, indeterminate = false, disabled = false, onChange, ariaLabel }: TriCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={ariaLabel}
      className="size-3.5 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-40"
    />
  )
}
