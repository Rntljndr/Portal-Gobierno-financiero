import { Button } from './button'
import { Icon } from './icon'

interface VolverBarProps {
  label: string
  onBack: () => void
}

/** "Volver" en la parte inferior, mismo patrón que el detalle de Presupuesto (servicio-detalle-page / editar-pep-n4-page). Reutilizado por Reales y Preliminares. */
export function VolverBar({ label, onBack }: VolverBarProps) {
  return (
    <div className="flex justify-end border-t border-border bg-white p-[14px_32px]">
      <Button variant="outline" onClick={onBack}>
        <Icon name="chevron_left" size={12} color="currentColor" /> {label}
      </Button>
    </div>
  )
}
