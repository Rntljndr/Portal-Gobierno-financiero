import { useState } from 'react'
import { Button } from '@/shared/ui'

interface ConfiguracionesGuardarPanelProps {
  onCancel: () => void
  onSave: (name: string) => void
}

export function ConfiguracionesGuardarPanel({ onCancel, onSave }: ConfiguracionesGuardarPanelProps) {
  const [name, setName] = useState('')

  const submit = () => {
    if (name.trim()) onSave(name.trim())
  }

  return (
    <div className="min-w-[280px] p-3.5">
      <label className="mb-1.5 block text-[11px] font-bold tracking-[0.05em] text-muted-foreground uppercase">Nombre</label>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Chile Q1 Nómina"
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className="h-9 w-full rounded-lg border border-border bg-white px-3 text-[13px] outline-none focus:border-primary"
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" size="sm" disabled={!name.trim()} className="disabled:opacity-50" onClick={submit}>
          Guardar
        </Button>
      </div>
    </div>
  )
}
