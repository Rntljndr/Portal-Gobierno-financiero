import { useState } from 'react'
import { Button, Drawer, Select } from '@/shared/ui'
import { monthKeys, monthLabelsShort, countryFlags } from '@/data/reporteria'
import type { BanderaMaestro } from '@/data/administracion/ingresos-banderas'

interface AgregarIngresoDrawerProps {
  open: boolean
  onClose: () => void
  ejercicio: number
  opciones: BanderaMaestro[]
  onGuardar: (bandera: string, meses: Record<string, number>) => void
}

const label = 'mb-1 block text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase'

function PaisDivisionPreview({ maestro }: { maestro: BanderaMaestro }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3">
      <div>
        <label className={label}>País</label>
        <div className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-[#F8FAFC] px-3 text-[12.5px]">
          {countryFlags[maestro.pais] ?? ''} {maestro.pais}
        </div>
      </div>
      <div>
        <label className={label}>División</label>
        <div className="flex h-9 items-center rounded-lg border border-border bg-[#F8FAFC] px-3 text-[12.5px]">{maestro.division}</div>
      </div>
    </div>
  )
}

function MesesInputGrid({ valores, onChange }: { valores: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {monthKeys.map((k, i) => (
        <div key={k}>
          <label className="mb-1 block text-[10px] text-muted-foreground">{monthLabelsShort[i]}</label>
          <input
            type="text"
            inputMode="decimal"
            value={valores[k] ?? ''}
            onChange={(e) => onChange(k, e.target.value)}
            placeholder="0,00"
            className="h-9 w-full rounded-lg border border-border px-2.5 text-[12.5px] outline-none focus:border-primary"
          />
        </div>
      ))}
    </div>
  )
}

export function AgregarIngresoDrawer({ open, onClose, ejercicio, opciones, onGuardar }: AgregarIngresoDrawerProps) {
  const [bandera, setBandera] = useState('')
  const [valores, setValores] = useState<Record<string, string>>({})

  const maestro = opciones.find((o) => o.nombre === bandera)
  const puedeGuardar = bandera !== '' && monthKeys.every((k) => valores[k] !== undefined && valores[k] !== '' && !Number.isNaN(Number(valores[k])))

  const reset = () => {
    setBandera('')
    setValores({})
  }

  const handleGuardar = () => {
    const meses = Object.fromEntries(monthKeys.map((k) => [k, Number(valores[k])]))
    onGuardar(bandera, meses)
    reset()
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Agregar ingreso"
      subtitle={`Ejercicio ${ejercicio}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} disabled={!puedeGuardar} className="disabled:opacity-50">
            Guardar
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <label className={label}>Bandera</label>
        {opciones.length === 0 ? (
          <div className="rounded-lg border border-border bg-[#F8FAFC] p-3 text-[12.5px] text-muted-foreground">
            Todas las banderas registradas ya tienen un ingreso cargado para este ejercicio.
          </div>
        ) : (
          <Select
            value={bandera}
            onChange={setBandera}
            options={opciones.map((o) => ({ value: o.nombre, label: o.nombre }))}
            placeholder="Seleccionar bandera..."
          />
        )}
      </div>

      {maestro && <PaisDivisionPreview maestro={maestro} />}

      <label className={label}>Valores mensuales</label>
      <MesesInputGrid valores={valores} onChange={(k, v) => setValores((prev) => ({ ...prev, [k]: v }))} />
    </Drawer>
  )
}
