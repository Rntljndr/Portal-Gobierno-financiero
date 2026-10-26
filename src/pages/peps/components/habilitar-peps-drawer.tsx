import { useState } from 'react'
import { Button, Drawer, MultiSelect } from '@/shared/ui'
import { pepsN7 } from '@/data/peps'

interface HabilitarPepsDrawerProps {
  open: boolean
  onClose: () => void
  onApplied: (count: number) => void
}

const PEP_N7_OPCIONES = [...new Set(Object.values(pepsN7).flat().map((r) => r.cod))].sort((a, b) => a.localeCompare(b))

export function HabilitarPepsDrawer({ open, onClose, onApplied }: HabilitarPepsDrawerProps) {
  const [selected, setSelected] = useState<string[]>([])

  const close = () => {
    setSelected([])
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      eyebrow="ABM PEPS · HABILITAR PEPS"
      title="Habilitar PEPs"
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            disabled={selected.length === 0}
            className="disabled:opacity-50"
            onClick={() => {
              onApplied(selected.length)
              setSelected([])
            }}
          >
            Habilitar
          </Button>
        </>
      }
    >
      <label className="mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro">PEPs N7</label>
      <MultiSelect placeholder="Selecciona los PEPs N7" options={PEP_N7_OPCIONES} values={selected} onChange={setSelected} />
      <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground">
        Se listan todos los PEP N7. La línea se crea en 0 en el ejercicio en planificación y el 100% se reparte entre los PEP N7 habilitados
        de un mismo PEP N4. Los que ya tengan presupuesto, o cuyo PEP N4 ya lo tenga, se informan sin cambios.
      </p>
    </Drawer>
  )
}
