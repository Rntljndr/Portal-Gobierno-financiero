import { useEffect, useState } from 'react'
import { Badge, Drawer } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'
import { ForecastDatosCard } from './forecast-datos-card'
import { TasasCambioTable } from './tasas-cambio-table'

interface ForecastAnterioresDrawerProps {
  open: boolean
  onClose: () => void
  rounds: ForecastRound[]
}

/** Listado de forecasts anteriores (cerrados) — seleccionar uno muestra su ficha de datos y sus tasas
 * de cambio, ambas en modo solo lectura (mismos componentes que forecast-detail-page.tsx). */
export function ForecastAnterioresDrawer({ open, onClose, rounds }: ForecastAnterioresDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (open) setSelectedId(rounds[0]?.id ?? null)
    // Solo al abrir el drawer — no queremos resetear la selección si `rounds` cambia de referencia mientras está abierto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const selected = rounds.find((r) => r.id === selectedId) ?? null

  return (
    <Drawer open={open} onClose={onClose} wide eyebrow="Forecast" title="Forecasts anteriores">
      <div className="mb-5 flex max-h-[220px] flex-col gap-2 overflow-y-auto">
        {rounds.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors',
              r.id === selectedId ? 'border-primary bg-[#EEF4FF]' : 'border-border bg-white hover:border-border-strong',
            )}
          >
            <div>
              <div className="text-[12.5px] font-semibold text-foreground">{r.titulo}</div>
              <div className="text-[11px] text-muted-foreground">
                {formatFechaCorta(r.fechaInicio)} — {formatFechaCorta(r.fechaTermino)}
              </div>
            </div>
            <Badge variant="primary">{r.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <ForecastDatosCard round={selected} className="mb-5" />
          <TasasCambioTable value={selected.tasasCambio} readOnly />
        </>
      )}
    </Drawer>
  )
}
