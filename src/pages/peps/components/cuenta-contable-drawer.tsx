import { useState } from 'react'
import { Button, Drawer, Select } from '@/shared/ui'
import { cuentaContableOpciones, type PepN4Row } from '@/data/peps'

interface CuentaContableDrawerProps {
  open: boolean
  onClose: () => void
  pep: PepN4Row
  onCreated: (cuenta: string) => void
}

export function CuentaContableDrawer({ open, onClose, pep, onCreated }: CuentaContableDrawerProps) {
  const [cuenta, setCuenta] = useState('')

  const close = () => {
    setCuenta('')
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      title="+ Cuenta contable"
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!cuenta}
            className="disabled:opacity-50"
            onClick={() => {
              onCreated(cuenta)
              close()
            }}
          >
            Crear
          </Button>
        </>
      }
    >
      <div className="mb-5 flex gap-2.5 rounded-lg border border-[#c7d6f5] bg-[#EEF3FC] p-3.5 text-[13px] leading-[1.55] text-foreground">
        Al agregar una nueva cuenta contable es necesario crear un PEP N4 con la misma información.
      </div>

      <div className="mb-5 rounded-lg border border-[#eef0f8] bg-[#f4f6fb] p-4">
        <div className="mb-3.5 text-[11px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Información del PEP N4</div>
        <div className="grid grid-cols-2 gap-3.5 text-[13px]">
          <div>
            <div className="mb-0.5 text-[11px] font-semibold text-muted-foreground">Código PEP</div>
            <div className="font-semibold text-foreground">{pep.pep}</div>
          </div>
          <div>
            <div className="mb-0.5 text-[11px] font-semibold text-muted-foreground">Servicio</div>
            <div className="text-foreground">{pep.servicio}</div>
          </div>
          <div>
            <div className="mb-0.5 text-[11px] font-semibold text-muted-foreground">País</div>
            <div className="text-foreground">{pep.pais}</div>
          </div>
          <div>
            <div className="mb-0.5 text-[11px] font-semibold text-muted-foreground">Área</div>
            <div className="text-foreground">{pep.area}</div>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">Cuenta contable *</label>
        <Select value={cuenta} onChange={setCuenta} options={cuentaContableOpciones} placeholder="Seleccionar cuenta..." />
      </div>
    </Drawer>
  )
}
