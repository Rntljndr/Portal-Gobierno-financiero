import { useState } from 'react'
import { Icon } from '@/shared/ui'

/** Input + botón para guardar la combinación actual de aperturas/métricas como una vista nueva del
 * usuario (nunca sobrescribe una de las 3 predefinidas — ver `guardarVista` en saved-views.ts). */
export function DetalleGuardarVista({ onGuardar }: { onGuardar: (nombre: string) => void }) {
  const [nombre, setNombre] = useState('')

  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-white p-3">
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la vista…"
        className="h-9 flex-1 rounded-lg border border-border px-3 text-[12.5px] outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={() => {
          if (!nombre.trim()) return
          onGuardar(nombre.trim())
          setNombre('')
        }}
        disabled={!nombre.trim()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[12.5px] font-bold text-white disabled:opacity-40"
      >
        <Icon name="save" size={13} color="#fff" /> Guardar vista actual
      </button>
    </div>
  )
}
