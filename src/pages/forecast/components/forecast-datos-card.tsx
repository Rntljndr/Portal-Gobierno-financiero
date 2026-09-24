import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { DataField } from '@/pages/servicio-detalle/components/data-field'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'

/** Mismo diseño y estructura que DataAccordion (servicio-detalle/components/data-accordion.tsx,
 * "Datos del servicio" — la ficha que se ve al seleccionar un PEP en Próximo ejercicio): acordeón sin
 * borde divisor entre header y body, grids de 3 campos (grid-cols-3 gap-5), DataField para
 * label/valor en texto plano. Reemplaza el uso de CrearForecastFormFields en modo solo lectura
 * (forecast-detail-page.tsx) — ese componente sigue igual para el flujo de creación, donde sí hace
 * falta que se vea como un formulario editable. */
interface ForecastDatosCardProps {
  round: ForecastRound
  className?: string
  /** Sin borde/fondo/chevron propios — para cuando ya vive dentro de otro recuadro que controla su
   * visibilidad desde afuera (F: "que se despliegue en el mismo recuadro", ver ForecastActivoCard). */
  embedded?: boolean
}

const fields = (round: ForecastRound) => (
  <>
    <div className="mb-5 grid grid-cols-3 gap-5">
      <DataField label="Título" value={round.titulo} />
      <DataField label="Tipo de forecast" value={round.tipo === 'global' ? 'Global' : 'Parcial'} />
      <DataField label="Porcentaje desvío" value={`${round.desvio}%`} />
    </div>
    <div className="mb-5 grid grid-cols-3 gap-5">
      <DataField label="Fecha de inicio" value={formatFechaCorta(round.fechaInicio)} />
      <DataField label="Fecha de término" value={formatFechaCorta(round.fechaTermino)} />
      <DataField label="Notificar usuarios" value={round.notificar ? 'Sí' : 'No'} />
    </div>
    <div className="grid grid-cols-3 gap-5">
      <DataField label="Descripción" value={round.descripcion} />
      {round.tipo === 'parcial' && <DataField label="PEPs habilitados" value={String(round.pepsCount ?? round.selPeps.length)} />}
    </div>
  </>
)

export function ForecastDatosCard({ round, className, embedded = false }: ForecastDatosCardProps) {
  const [open, setOpen] = useState(true)

  if (embedded) return <div className={className}>{fields(round)}</div>

  return (
    <div className={cn('rounded-xl border border-border bg-white', className ?? 'mx-8 mb-5')}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[16px_20px] text-left">
        <span className="text-[15px] font-bold text-primary">Datos del Forecast</span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>

      {open && <div className="p-[0_20px_20px]">{fields(round)}</div>}
    </div>
  )
}
