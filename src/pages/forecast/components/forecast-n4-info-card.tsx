import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { pepN4Meta } from '@/data/pep-n4-meta'
import { DataField } from '@/pages/servicio-detalle/components/data-field'

interface ForecastN4InfoCardProps {
  n4Codigo: string
  n4Nombre: string
  pais: string
  equipo: string
}

/** Mismo diseño y estructura que DataAccordion (servicio-detalle/components/data-accordion.tsx,
 * "Datos del servicio" — la ficha que se ve al seleccionar un PEP en Próximo ejercicio): acordeón sin
 * borde divisor entre header y body, 3 grids de 3 campos (grid-cols-3 gap-5), DataField para
 * label/valor en texto plano. Se reutiliza DataField tal cual (componente puro, sin acoplamiento a
 * servicio-detalle) en vez de duplicarlo, para garantizar que ambas fichas se vean idénticas. */
export function ForecastN4InfoCard({ n4Codigo, n4Nombre, pais, equipo }: ForecastN4InfoCardProps) {
  const [open, setOpen] = useState(true)
  const meta = pepN4Meta[n4Codigo]

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-2 p-[16px_20px] text-left">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-primary">
          {n4Codigo} – {n4Nombre}
        </span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>

      {open && (
        <div className="p-[0_20px_20px]">
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="País" value={pais} />
            <DataField label="Gerencia padre" value={meta?.gerenciaPadre ?? ''} />
            <DataField label="Cuenta contable" value={meta?.cuentaContable ?? ''} />
          </div>
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="Gerencia" value={meta?.gerencia ?? ''} />
            <DataField label="Equipo" value={equipo} />
            <DataField label="Bandera" value={meta?.bandera ?? ''} />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <DataField label="Centro de costo" value={meta?.centroCosto ?? ''} />
            <DataField label="Moneda" value={meta?.moneda ?? ''} />
            <DataField label="Código de servicio" value={n4Codigo} />
          </div>
        </div>
      )}
    </div>
  )
}
