interface HideZeroToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}

/** Toggle "Ocultar líneas en cero" (Ajuste T5), activado por defecto — reutilizado por las grillas N4 y N7. */
export function HideZeroToggle({ checked, onChange }: HideZeroToggleProps) {
  return (
    <label className="flex items-center gap-1.5 text-[12px] font-medium text-cs-gris-oscuro">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-primary" />
      Ocultar líneas en cero
    </label>
  )
}
