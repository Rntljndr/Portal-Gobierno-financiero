import { useState, type ReactNode } from 'react'
import { Card, CardTitle, Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

interface SeccionProps {
  /** Título en forma de pregunta o afirmación ("Vamos 4,2 % sobre el plan a julio"). */
  titulo: ReactNode
  subtitulo?: ReactNode
  /** Controles junto al título (no colapsan la sección al hacer clic). */
  acciones?: ReactNode
  defaultOpen?: boolean
  id?: string
  className?: string
  children: ReactNode
}

/** Slot / Card-chart del design system (radius 12, borde #F1F3F8, padding 24) con título de Card-alert,
 * colapsable con el chevrón a la derecha: cada vista trae ciertos bloques desplegados, ninguno se oculta. */
export function Seccion({ titulo, subtitulo, acciones, defaultOpen = true, id, className, children }: SeccionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section id={id} className={cn('scroll-mt-4', className)}>
      <Card>
        <div className="flex flex-wrap items-start gap-3">
          <button type="button" onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 basis-[320px] text-left" aria-expanded={open}>
            <CardTitle title={titulo} subtitle={subtitulo} />
          </button>
          {open && acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Colapsar sección' : 'Expandir sección'}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-surface-hover"
          >
            <Icon name={open ? 'chevron_up' : 'chevron_down'} size={18} color="currentColor" />
          </button>
        </div>
        {open && <div className="mt-4">{children}</div>}
      </Card>
    </section>
  )
}
