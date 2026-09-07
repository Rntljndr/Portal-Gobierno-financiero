import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/shared/ui'
import { countryFlags } from '@/data/reporteria'
import { getCierreSapFechasOrdenadas } from '@/data/preliminares'

interface CierreIndicatorProps {
  mesAbierto: string
}

/**
 * Ajuste P4: fecha de cierre contable SAP, distinta por país — visible para todos los usuarios (no solo CdG).
 * Mismo estilo Tag/Blue del sistema (pill, fondo claro, texto primario) que el resto de los tags informativos del portal.
 */
export function CierreIndicator({ mesAbierto }: CierreIndicatorProps) {
  const [open, setOpen] = useState(false)
  const ordenadas = getCierreSapFechasOrdenadas(mesAbierto)

  if (ordenadas.length === 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-muted px-3.5 py-1.5 text-[12.5px] font-semibold text-muted-foreground">
        <Icon name="calendar" size={14} color="currentColor" />
        No hay fecha de cierre contable definida para este período
      </div>
    )
  }

  const [proxima, ...otras] = ordenadas

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={otras.length === 0}
          className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-primary/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-primary disabled:cursor-default"
        >
          <Icon name="calendar" size={14} color="currentColor" />
          <span>Cierre contable SAP:</span>
          <span className="inline-flex items-center gap-1 font-bold">
            <span>{countryFlags[proxima.pais] ?? '🏳️'}</span>
            <span>{proxima.fecha}</span>
          </span>
          {otras.length > 0 && <Icon name={open ? 'chevron_up' : 'chevron_down'} size={12} color="currentColor" />}
        </button>
      </Popover.Trigger>
      {otras.length > 0 && (
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={4}
            className="z-[9100] w-72 rounded-lg border border-border bg-white p-1.5 shadow-[0_8px_24px_rgba(6,20,148,0.12)]"
          >
            <div className="p-1.5 pb-1 text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">Otros países</div>
            {otras.map((o) => (
              <div key={o.pais} className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-[12.5px]">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span>{countryFlags[o.pais] ?? '🏳️'}</span>
                  {o.pais}
                </span>
                <span className="font-bold text-foreground">{o.fecha}</span>
              </div>
            ))}
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  )
}
