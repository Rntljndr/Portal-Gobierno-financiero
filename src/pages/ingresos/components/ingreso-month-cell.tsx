import { useEffect, useState } from 'react'
import { formatMonto } from '../lib/format-monto'

interface IngresoMonthCellProps {
  value: number
  locked: boolean
  onChange: (value: number) => void
}

/** Edición habilitada por fila desde la columna Edición: apenas la fila se desbloquea, la celda ya es
 * un input (sin un click adicional) — se puede tipear o pegar el valor directo, y el cambio se
 * confirma al perder el foco. Bloqueada, es de solo lectura. */
export function IngresoMonthCell({ value, locked, onChange }: IngresoMonthCellProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    if (!locked) setDraft(String(value))
  }, [locked, value])

  if (locked) {
    return (
      <td className="p-[10px_10px] text-right text-[12.5px] tabular-nums whitespace-nowrap text-foreground">{formatMonto(value)}</td>
    )
  }

  return (
    <td className="p-[4px_6px] text-right">
      <input
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const parsed = Number(draft.replace(',', '.'))
          if (!Number.isNaN(parsed)) onChange(parsed)
        }}
        className="w-[110px] rounded-md border border-primary bg-white px-2 py-1 text-right text-[12.5px] tabular-nums outline-none"
      />
    </td>
  )
}
