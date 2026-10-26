import { cn } from '@/shared/lib/utils'

interface AdministracionToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

/** Switch on/off reutilizable — mismo patrón visual que los toggles Visualizar/Editar de "Alcances y
 * permisos" de referencia (no hay primitivo Switch instalado en el proyecto, así que es un botón simple). */
export function AdministracionToggle({ checked, onChange, label, disabled }: AdministracionToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-[#D7DCEA]',
      )}
    >
      <span className={cn('absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')} />
    </button>
  )
}
