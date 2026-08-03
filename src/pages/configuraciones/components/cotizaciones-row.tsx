import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { meses, type PaisCotizacion } from '@/data/configuraciones'

interface CotizacionesRowProps {
  pais: PaisCotizacion
  values: Record<string, string>
  onSave: (pais: string, values: Record<string, string>) => void
}

export function CotizacionesRow({ pais, values, onSave }: CotizacionesRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(values)

  const startEdit = () => {
    setDraft(values)
    setEditing(true)
  }

  return (
    <tr className={`border-t border-border transition-colors ${editing ? 'bg-[#F0F5FF]' : 'hover:bg-[#F5F8FE]'}`}>
      <td className="p-[8px_16px] font-semibold whitespace-nowrap text-foreground">{pais.name}</td>
      <td className="p-[8px_8px] text-muted-foreground">{pais.moneda}</td>
      {meses.map((m) => (
        <td key={m} className="p-[5px_6px] text-right">
          {editing ? (
            <input
              type="number"
              value={draft[m] ?? '0'}
              onChange={(e) => setDraft((prev) => ({ ...prev, [m]: e.target.value }))}
              className="h-[26px] w-[60px] rounded border border-primary px-1.5 text-right text-xs outline-none"
            />
          ) : (
            <span className="text-foreground">{parseFloat(values[m] || '0').toFixed(2)}</span>
          )}
        </td>
      ))}
      <td className="p-[5px_16px] text-right">
        {editing ? (
          <button
            type="button"
            onClick={() => {
              onSave(pais.name, draft)
              setEditing(false)
            }}
            className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#003685]"
          >
            Guardar
          </button>
        ) : (
          <button type="button" onClick={startEdit} title="Editar" className="p-1">
            <Icon name="edit" size={14} color="#0047B0" />
          </button>
        )}
      </td>
    </tr>
  )
}
