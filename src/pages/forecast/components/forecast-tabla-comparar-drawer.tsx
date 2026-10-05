import { useEffect, useState } from 'react'
import { Button, Drawer, Select } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'
import { EMPTY_TABLA_COMPARATIVA, type ForecastTablaComparativa } from '../lib/forecast-tabla-comparativa'

interface ForecastTablaCompararDrawerProps {
  open: boolean
  onClose: () => void
  opciones: ForecastRound[]
  applied: ForecastTablaComparativa
  onApply: (next: ForecastTablaComparativa) => void
}

/** "Comparar con" de las tablas de servicios (mismo comportamiento que el botón Comparar de Reales,
 * ver reales/components/reales-comparison-drawer.tsx) — solo dos campos, sin "Año anterior" (no aplica
 * a Forecast, misma decisión que forecast-comparativa-drawer.tsx#ForecastComparativaDrawer). Cada
 * campo marcado agrega una fila de comparación bajo cada línea de servicio en la tabla. */
export function ForecastTablaCompararDrawer({ open, onClose, opciones, applied, onApply }: ForecastTablaCompararDrawerProps) {
  const [draft, setDraft] = useState<ForecastTablaComparativa>(applied)

  useEffect(() => {
    if (open) setDraft(applied)
  }, [open, applied])

  const handleAplicar = () => {
    onApply(draft)
    onClose()
  }
  const handleLimpiar = () => {
    onApply(EMPTY_TABLA_COMPARATIVA)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Comparar con"
      footer={
        <>
          <Button variant="outline" onClick={handleLimpiar}>
            Limpiar
          </Button>
          <Button variant="primary" onClick={handleAplicar}>
            Aplicar
          </Button>
        </>
      }
    >
      <label className="flex cursor-pointer items-center gap-3 border-b border-[#F1F4FB] py-3">
        <input type="checkbox" checked={draft.plan} onChange={(e) => setDraft({ ...draft, plan: e.target.checked })} className="size-4 accent-primary" />
        <div>
          <div className="text-[13px] font-semibold text-foreground">Plan</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Plan aprobado del ejercicio</div>
        </div>
      </label>

      <div className="py-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={draft.forecastRoundId !== null}
            onChange={(e) => setDraft({ ...draft, forecastRoundId: e.target.checked ? (opciones[0]?.id ?? null) : null })}
            disabled={opciones.length === 0}
            className="size-4 accent-primary"
          />
          <div>
            <div className="text-[13px] font-semibold text-foreground">Forecast</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {opciones.length === 0 ? 'No hay forecasts cerrados para comparar' : 'Comparar con un forecast cerrado'}
            </div>
          </div>
        </label>
        {draft.forecastRoundId !== null && (
          <div className="mt-3">
            <Select
              value={draft.forecastRoundId}
              onChange={(id) => setDraft({ ...draft, forecastRoundId: id })}
              options={opciones.map((r) => ({ value: r.id, label: `${r.titulo} · ${formatFechaCorta(r.fechaInicio)}–${formatFechaCorta(r.fechaTermino)}` }))}
            />
          </div>
        )}
      </div>
    </Drawer>
  )
}
