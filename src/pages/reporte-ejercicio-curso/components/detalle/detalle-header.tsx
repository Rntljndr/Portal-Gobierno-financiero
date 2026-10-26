import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { VistaGuardada } from '../../lib/detalle/saved-views'

interface DetalleHeaderProps {
  vistas: VistaGuardada[]
  nombreActiva: string
  onCambiarVista: (nombre: string) => void
  opexValue: string
  onOpenConfig: () => void
}

/** Barra superior del Detalle configurable: todas las vistas (predefinidas + guardadas por el usuario +
 * OPEX IT Chile) como tabs siempre visibles, en vez de un dropdown, y el acceso a "Configurar vista" —
 * visible también para OPEX IT Chile, igual que para el resto de las vistas. El botón de Filtros vive
 * aparte, arriba de esta sección (ver `DetalleFilterToggle`/`OpexFilterToggle` en `detalle-vista.tsx`),
 * no acá. */
export function DetalleHeader({ vistas, nombreActiva, onCambiarVista, opexValue, onOpenConfig }: DetalleHeaderProps) {
  const tabs = [
    ...vistas.map((v) => ({ value: v.nombre, label: v.predefinida ? `${v.nombre} (estándar)` : v.nombre })),
    { value: opexValue, label: 'OPEX IT Chile' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onCambiarVista(t.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[12px] font-bold whitespace-nowrap',
              t.value === nombreActiva ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:border-primary/40',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenConfig}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-white px-3 py-2 text-[12.5px] font-bold text-primary hover:bg-[#F4F7FE]"
      >
        <Icon name="config" size={13} color="#0047B0" /> Configurar vista
      </button>
    </div>
  )
}
