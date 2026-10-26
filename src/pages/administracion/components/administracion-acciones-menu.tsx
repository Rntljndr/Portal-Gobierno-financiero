import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/shared/ui'

interface AdministracionAccionesMenuProps {
  onAction: (tipo: 'ver' | 'editar' | 'eliminar') => void
}

/** Menú "..." de Ver detalle / Editar / Eliminar por fila — mismo patrón visual que el "Acciones" de
 * Administración > Gerencia y equipo; las 3 acciones solo muestran un toast (no hay backend detrás). */
export function AdministracionAccionesMenu({ onAction }: AdministracionAccionesMenuProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Acciones"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        >
          <Icon name="dots" size={14} color="currentColor" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          onClick={(e) => e.stopPropagation()}
          className="z-[9100] w-[150px] overflow-hidden rounded-lg border border-border bg-white py-1 shadow-[0_8px_24px_rgba(6,20,148,0.12)]"
        >
          {(
            [
              ['ver', 'Ver detalle', 'eye'],
              ['editar', 'Editar', 'edit'],
              ['eliminar', 'Eliminar', 'trash'],
            ] as const
          ).map(([tipo, label, icon]) => (
            <Popover.Close asChild key={tipo}>
              <button
                type="button"
                onClick={() => onAction(tipo)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] hover:bg-surface-hover ${tipo === 'eliminar' ? 'text-destructive' : 'text-foreground'}`}
              >
                <Icon name={icon} size={13} color="currentColor" />
                {label}
              </button>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
