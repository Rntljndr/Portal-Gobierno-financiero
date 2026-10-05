import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { DataField } from '@/pages/servicio-detalle/components/data-field'
import type { RealesN4Row } from '@/data/reales'

interface RealesN4InfoCardProps {
  n4: RealesN4Row
}

/** Ficha "Datos del servicio" al entrar a un N4 (F) — mismo diseño y estructura que
 * ForecastN4InfoCard (pages/forecast/components/forecast-n4-info-card.tsx) y DataAccordion
 * (servicio-detalle/components/data-accordion.tsx): acordeón sin borde divisor entre header y body, 3
 * grids de 3 campos (grid-cols-3 gap-5), DataField para label/valor en texto plano. A diferencia de
 * Forecast (que necesita pepN4Meta), acá todo ya vive directo en el propio RealesRow. */
export function RealesN4InfoCard({ n4 }: RealesN4InfoCardProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-2 p-[16px_20px] text-left">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-primary">
          {n4.codigo} – {n4.nombre}
        </span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>

      {open && (
        <div className="p-[0_20px_20px]">
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="País" value={n4.pais} />
            <DataField label="Gerencia padre" value={n4.gerenciaPadre} />
            <DataField label="Cuenta contable" value={n4.cuentaContable} />
          </div>
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="Gerencia" value={n4.gerencia} />
            <DataField label="Equipo" value={n4.equipo} />
            <DataField label="Bandera" value={n4.bandera} />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <DataField label="Centro de costo" value={n4.centroCosto} />
            <DataField label="Moneda" value={n4.moneda} />
            <DataField label="Código de servicio" value={n4.codigo} />
          </div>
        </div>
      )}
    </div>
  )
}
