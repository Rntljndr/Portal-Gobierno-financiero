import { useEffect, useState } from 'react'
import { Button, Drawer, Textarea } from '@/shared/ui'
import type { ForecastMesNota } from '@/data/forecast-lineas'
import type { LlaveSegment } from '../lib/forecast-llave'
import { formatForecastAmount } from '../lib/format-forecast-amount'
import { ForecastLlaveBar } from './forecast-llave-bar'

const label = 'mb-1.5 block text-[12px] font-semibold text-cs-gris-oscuro'

interface ForecastEditDrawerProps {
  open: boolean
  onClose: () => void
  level: 'n4' | 'n7'
  codigo: string
  nombre: string
  monthLabel: string
  currentValue: number
  llave?: LlaveSegment[]
  onSubmit: (monto: number, nota: ForecastMesNota) => void
}

/** Formulario de edición de una celda de mes, reusado por N4 y N7 (Tarea 7: mismo componente en ambos casos). */
export function ForecastEditDrawer({ open, onClose, level, codigo, nombre, monthLabel, currentValue, llave, onSubmit }: ForecastEditDrawerProps) {
  const [monto, setMonto] = useState(String(currentValue))
  const [justificacion, setJustificacion] = useState('')
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    if (!open) return
    setMonto(String(currentValue))
    setJustificacion('')
    setComentario('')
  }, [open, currentValue])

  const montoNum = Number(monto)
  const canSubmit = monto.trim() !== '' && !Number.isNaN(montoNum) && montoNum >= 0

  return (
    <Drawer
      open={open}
      onClose={onClose}
      eyebrow={level === 'n4' ? 'Editar servicio N4' : 'Editar PEP N7'}
      title={nombre}
      subtitle={`${codigo} · ${monthLabel}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canSubmit} onClick={() => onSubmit(montoNum, { justificacion: justificacion || undefined, comentario: comentario || undefined })}>
            Guardar
          </Button>
        </>
      }
    >
      <div className="mb-5">
        <label className={label}>Monto {monthLabel} *</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-right text-[13px] outline-none focus:border-primary"
        />
        <div className="mt-1 text-[11px] text-muted-foreground">Valor actual: {formatForecastAmount(currentValue)}</div>
      </div>

      {level === 'n4' && llave && llave.length > 0 && (
        <div className="mb-5 rounded-lg border border-border bg-[#F8F9FD] p-3">
          <div className="mb-2 text-[11px] font-bold tracking-[0.04em] text-muted-foreground uppercase">Se distribuirá entre los N7 según la llave de distribución</div>
          <ForecastLlaveBar segments={llave} />
        </div>
      )}

      <div className="mb-5">
        <label className={label}>Justificación</label>
        <Textarea value={justificacion} onChange={(e) => setJustificacion(e.target.value)} placeholder="Explicá el motivo del ajuste..." />
      </div>
      <div>
        <label className={label}>Comentarios</label>
        <Textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Comentarios adicionales..." />
      </div>
    </Drawer>
  )
}
