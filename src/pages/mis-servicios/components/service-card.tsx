import { Icon } from '@/shared/ui'
import type { Servicio } from '@/data/services'
import { ServiceCardBadges } from './service-card-badges'
import { ServiceCardMetrics } from './service-card-metrics'

const EDITORES = ['Ana Martínez', 'Carlos Soto', 'Valentina Cruz', 'Diego Rojas', 'Sofía Herrera']

function isPendiente(s: Servicio) {
  return s.estado === 'Borrador' || s.estado === 'Requiere revisión'
}

interface ServiceCardProps {
  s: Servicio
  selected: boolean
  onToggleSelected: (id: string) => void
  onOpen: () => void
}

export function ServiceCard({ s, selected, onToggleSelected, onOpen }: ServiceCardProps) {
  const fechaEdicion = new Date(`${s.ultimaEdicion}T12:00:00`).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const editadoPor = EDITORES[parseInt(s.id.replace(/\D/g, ''), 10) % EDITORES.length]

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-px hover:border-cs-azul hover:shadow-[0_8px_20px_rgba(6,20,148,0.08)]">
      <div className="mb-2.5 flex items-start gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center text-[11px] font-bold tracking-[0.04em] text-primary tabular-nums">
            {s.pep}
            <span className="mx-2.5 text-muted-foreground">•</span>
            {s.pais}
          </div>
          <div className="line-clamp-2 text-[13.5px] leading-snug font-bold tracking-tight text-foreground">
            {s.nombre}
          </div>
          <div className="mt-0.5 text-[11.5px] text-muted-foreground">
            {s.gerenciaPadre} <span className="text-slate-300">•</span> {s.gerencia}{' '}
            <span className="text-slate-300">•</span> {s.equipo}
          </div>
        </div>
        {isPendiente(s) && (
          <input
            type="checkbox"
            className="mt-0.5 size-[15px] shrink-0 cursor-pointer"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelected(s.id)}
          />
        )}
      </div>

      <ServiceCardBadges estado={s.estado} tipoOrigen={s.tipoOrigen} />
      <ServiceCardMetrics s={s} />

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
        <div className="text-[11.5px] text-muted-foreground">
          <span className="font-medium">Última edición:</span> {fechaEdicion}
          <span className="mx-1.5 opacity-50">•</span>
          {editadoPor}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
            aria-label="Editar"
            className="flex size-7 items-center justify-center rounded-md text-primary opacity-80 hover:bg-[#E8EEFF] hover:opacity-100"
          >
            <Icon name="edit" size={13} color="currentColor" />
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="Eliminar"
            className="flex size-7 items-center justify-center rounded-md text-[#B42318] opacity-80 hover:bg-[#FEE8E8] hover:opacity-100"
          >
            <Icon name="trash" size={13} color="currentColor" />
          </button>
        </div>
      </div>
    </div>
  )
}
