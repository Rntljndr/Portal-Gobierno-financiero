import { useState } from 'react'
import { Button, Drawer, Select } from '@/shared/ui'
import {
  banderaPaisOpciones,
  cecoOpciones,
  cuentaContableOpciones,
  destinoOpciones,
  equipoOpciones,
  gerenciaOpciones,
  pepFiltroOpciones,
  type PepN4Row,
} from '@/data/peps'

interface CrearPepN4Form {
  pais: string
  area: string
  bandera: string
  cuenta: string
  destino: string
  ceco: string
  gerencia: string
  equipo: string
}

const EMPTY_FORM: CrearPepN4Form = { pais: '', area: '', bandera: '', cuenta: '', destino: '', ceco: '', gerencia: '', equipo: '' }

const label = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'

function Field({ children, text, required }: { children: React.ReactNode; text: string; required?: boolean }) {
  return (
    <div>
      <label className={label}>
        {text} {required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
    </div>
  )
}

interface CrearPepN4DrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (row: PepN4Row) => void
}

export function CrearPepN4Drawer({ open, onClose, onCreated }: CrearPepN4DrawerProps) {
  const [form, setForm] = useState<CrearPepN4Form>(EMPTY_FORM)
  const set = <K extends keyof CrearPepN4Form>(key: K, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const canSubmit = form.pais && form.area && form.bandera && form.cuenta

  const close = () => {
    setForm(EMPTY_FORM)
    onClose()
  }

  const submit = () => {
    if (!canSubmit) return
    const seq = String(Date.now()).slice(-4)
    onCreated({
      pep: `${form.pais.slice(0, 2).toUpperCase()}-N4-${seq}`,
      pais: form.pais,
      moneda: 'ARS',
      cod: seq,
      servicio: `Nuevo servicio ${seq}`,
      area: form.area,
      cuenta: form.cuenta,
      fechaCreacion: new Date().toISOString().slice(0, 10),
      ultimaEdicion: { fecha: new Date().toISOString().slice(0, 10), usuario: 'Andrea Morales' },
    })
    close()
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Crear PEP N4"
      wide
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canSubmit} className="disabled:opacity-50" onClick={submit}>
            Crear PEP N4
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        <Field text="País" required>
          <Select value={form.pais} onChange={(v) => set('pais', v)} options={pepFiltroOpciones.pais} />
        </Field>
        <Field text="Área" required>
          <Select value={form.area} onChange={(v) => set('area', v)} options={pepFiltroOpciones.area} />
        </Field>
        <Field text="Bandera" required>
          <Select value={form.bandera} onChange={(v) => set('bandera', v)} options={banderaPaisOpciones.map((b) => `${b.emoji} ${b.label}`)} />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Field text="Cuenta contable" required>
          <Select value={form.cuenta} onChange={(v) => set('cuenta', v)} options={cuentaContableOpciones} />
        </Field>
        <Field text="Destino">
          <Select value={form.destino} onChange={(v) => set('destino', v)} options={destinoOpciones} />
        </Field>
        <Field text="Centro de costos">
          <Select value={form.ceco} onChange={(v) => set('ceco', v)} options={cecoOpciones} />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Field text="Gerencia">
          <Select value={form.gerencia} onChange={(v) => set('gerencia', v)} options={gerenciaOpciones} />
        </Field>
        <Field text="Equipo">
          <Select value={form.equipo} onChange={(v) => set('equipo', v)} options={equipoOpciones} />
        </Field>
      </div>
    </Drawer>
  )
}
