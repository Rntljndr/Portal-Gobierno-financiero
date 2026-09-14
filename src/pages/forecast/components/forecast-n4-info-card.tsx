import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { pepN4Meta } from '@/data/pep-n4-meta'

const label = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'

function ReadOnlyField({ text, value }: { text: string; value: string }) {
  return (
    <div>
      <label className={label}>{text}</label>
      <div className="min-h-10 rounded-lg border border-[#eef0f8] bg-[#f4f6fb] px-3 py-2 text-[13px] text-foreground">{value || '—'}</div>
    </div>
  )
}

interface ForecastN4InfoCardProps {
  n4Codigo: string
  n4Nombre: string
  pais: string
  equipo: string
}

/** Tarjeta colapsable con la ficha del servicio N4 — mismo patrón visual que PepN4Card (ABM PEPS), en solo lectura porque Gerencia/Equipo son datos administrativos, no de Forecast. */
export function ForecastN4InfoCard({ n4Codigo, n4Nombre, pais, equipo }: ForecastN4InfoCardProps) {
  const [open, setOpen] = useState(true)
  const meta = pepN4Meta[n4Codigo]

  return (
    <div className="mx-8 mb-6 overflow-hidden rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-2 p-[16px_20px] text-left">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-primary">
          {n4Codigo} – {n4Nombre}
        </span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>

      {open && (
        <div className="border-t border-[#eef0f8] p-[20px]">
          <div className="grid grid-cols-4 gap-4">
            <ReadOnlyField text="País" value={pais} />
            <ReadOnlyField text="Equipo" value={equipo} />
            <ReadOnlyField text="Gerencia padre" value={meta?.gerenciaPadre ?? '—'} />
            <ReadOnlyField text="Gerencia" value={meta?.gerencia ?? '—'} />
            <ReadOnlyField text="Centro de costo" value={meta?.centroCosto ?? '—'} />
            <ReadOnlyField text="Cuenta contable" value={meta?.cuentaContable ?? '—'} />
            <ReadOnlyField text="Bandera" value={meta?.bandera ?? '—'} />
            <ReadOnlyField text="Moneda" value={meta?.moneda ?? '—'} />
          </div>
        </div>
      )}
    </div>
  )
}
