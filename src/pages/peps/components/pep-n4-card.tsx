import { useState } from 'react'
import { Button, Icon, Select } from '@/shared/ui'
import { equipoOpciones, gerenciaOpciones, type PepN4Row } from '@/data/peps'

const label = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'

function ReadOnlyField({ text, value }: { text: string; value: string }) {
  return (
    <div>
      <label className={label}>{text}</label>
      <div className="min-h-10 rounded-lg border border-[#eef0f8] bg-[#f4f6fb] px-3 py-2 text-[13px] text-foreground">{value || '—'}</div>
    </div>
  )
}

interface PepN4CardProps {
  pep: PepN4Row
  onGuardar: (gerencia: string, equipo: string) => void
  onNuevaCuenta: () => void
}

export function PepN4Card({ pep, onGuardar, onNuevaCuenta }: PepN4CardProps) {
  const [open, setOpen] = useState(true)
  const [gerencia, setGerencia] = useState('PMO')
  const [equipo, setEquipo] = useState('Desarrollo')

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between p-[16px_20px]">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold text-primary">
            {pep.pep} – {pep.servicio}
          </span>
          <Icon name={open ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
        </button>
        <Button variant="outline" size="sm" onClick={onNuevaCuenta}>
          + Cuenta contable
        </Button>
      </div>

      {open && (
        <div className="border-t border-[#eef0f8] p-[20px]">
          <div className="mb-5 grid grid-cols-3 gap-4">
            <ReadOnlyField text="Servicio *" value={pep.servicio} />
            <ReadOnlyField text="País *" value={pep.pais} />
            <ReadOnlyField text="Área *" value={pep.area} />
          </div>
          <div className="mb-5 border-t border-[#eef0f8]" />
          <div className="mb-5 grid grid-cols-3 gap-4">
            <ReadOnlyField text="Cuenta contable *" value={pep.cuenta} />
            <div>
              <label className={label}>Gerencia *</label>
              <Select value={gerencia} onChange={setGerencia} options={gerenciaOpciones} />
            </div>
            <div>
              <label className={label}>Equipo *</label>
              <Select value={equipo} onChange={setEquipo} options={equipoOpciones} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="onGreenCard" className="border-[#1F8A5B] bg-[#22976B] text-white hover:bg-[#1F8A5B]" onClick={() => onGuardar(gerencia, equipo)}>
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
