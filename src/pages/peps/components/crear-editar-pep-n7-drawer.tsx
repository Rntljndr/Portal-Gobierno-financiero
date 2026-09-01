import { useEffect, useState } from 'react'
import { Button, Drawer, Select } from '@/shared/ui'
import { banderaPaisOpciones, cecoOpciones, destinoOpciones, type PepN7Row } from '@/data/peps'

interface PepN7Form {
  bandera: string
  destino: string
  ceco: string
}

const EMPTY_FORM: PepN7Form = { bandera: '', destino: '', ceco: '' }

const label = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'

function bandera(row: PepN7Row) {
  return banderaPaisOpciones.find((b) => b.emoji === row.bandera)
}

interface CrearEditarPepN7DrawerProps {
  open: boolean
  onClose: () => void
  editing: PepN7Row | null
  pepCodigo: string
  onSubmit: (form: PepN7Form) => void
}

export function CrearEditarPepN7Drawer({ open, onClose, editing, pepCodigo, onSubmit }: CrearEditarPepN7DrawerProps) {
  const [form, setForm] = useState<PepN7Form>(EMPTY_FORM)

  useEffect(() => {
    if (editing) {
      setForm({ bandera: `${editing.bandera} ${bandera(editing)?.label ?? ''}`.trim(), destino: editing.destino, ceco: editing.ceco })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editing, open])

  const set = <K extends keyof PepN7Form>(key: K, value: string) => setForm((f) => ({ ...f, [key]: value }))
  const canSubmit = editing ? form.bandera && form.destino && form.ceco : form.bandera && form.ceco

  const banderaOpts = banderaPaisOpciones.map((b) => `${b.emoji} ${b.label}`)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={editing ? 'Editar PEP N7' : 'Crear PEP N7'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canSubmit} className="disabled:opacity-50" onClick={() => onSubmit(form)}>
            {editing ? 'Guardar cambios' : 'Crear PEP N7'}
          </Button>
        </>
      }
    >
      <div className="mb-5 rounded-lg border border-[#eef0f8] bg-[#f4f6fb] p-4">
        <div className="mb-2.5 text-[11px] font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {editing ? 'Código PEP N7' : 'Datos del PEP padre (no modificables)'}
        </div>
        {editing ? (
          <div className="text-[14px] font-bold text-foreground">{editing.cod}</div>
        ) : (
          <div className="text-[13px] font-semibold text-foreground">{pepCodigo}</div>
        )}
      </div>

      <div className="mb-5">
        <label className={label}>Bandera *</label>
        <Select value={form.bandera} onChange={(v) => set('bandera', v)} options={banderaOpts} />
      </div>

      {editing && (
        <div className="mb-5">
          <label className={label}>Destino *</label>
          <Select value={form.destino} onChange={(v) => set('destino', v)} options={destinoOpciones} />
        </div>
      )}

      <div>
        <label className={label}>Centro de costos *</label>
        <Select value={form.ceco} onChange={(v) => set('ceco', v)} options={cecoOpciones} />
      </div>
    </Drawer>
  )
}
