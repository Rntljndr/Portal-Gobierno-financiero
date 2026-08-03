import { useState } from 'react'
import { Icon } from '@/shared/ui'
import type { Servicio } from '@/data/services'
import { DataField } from './data-field'

export function DataAccordion({ s }: { s: Servicio }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mx-8 mb-5 rounded-xl border border-border bg-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-[16px_20px] text-left">
        <span className="text-[15px] font-bold text-primary">Datos del servicio</span>
        <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
      </button>
      {open && (
        <div className="p-[0_20px_20px]">
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="País" value={s.pais} />
            <DataField label="Gerencia padre" value={s.gerenciaPadre} />
            <DataField label="Cuenta contable" value={s.cuentaContable} />
          </div>
          <div className="mb-5 grid grid-cols-3 gap-5">
            <DataField label="Gerencia" value={s.gerencia} />
            <DataField label="Equipo" value={s.equipo} />
            <DataField label="Bandera" value={s.bandera} />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <DataField label="Contrato" value={s.contrato} />
            <DataField label="Código de servicio" value={s.codigo} />
            <DataField label="Código de PEP" value={s.pep} />
          </div>
        </div>
      )}
    </div>
  )
}
