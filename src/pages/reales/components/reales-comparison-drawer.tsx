import { useEffect, useState } from 'react'
import { Button, Drawer } from '@/shared/ui'
import { useForecastStore } from '@/pages/forecast/lib/use-forecast-store'
import { EMPTY_COMPARISONS, type Comparisons } from '../lib/comparisons'
import { defaultForecastRoundId, forecastComparisonOptions } from '../lib/forecast-comparison'
import { RealesForecastCheck } from './reales-forecast-check'

interface RealesComparisonDrawerProps {
  open: boolean
  onClose: () => void
  applied: Comparisons
  onApply: (next: Comparisons) => void
}

export function RealesComparisonDrawer({ open, onClose, applied, onApply }: RealesComparisonDrawerProps) {
  const [draft, setDraft] = useState<Comparisons>(applied)
  const [lastRoundId, setLastRoundId] = useState<string | null>(null)
  const { rounds } = useForecastStore()
  const forecastOptions = forecastComparisonOptions(rounds)
  const forecastChecked = draft.forecastRoundId !== null

  useEffect(() => {
    if (open) {
      setDraft(applied)
      // El forecast activo (último cerrado) queda listo para elegir apenas se marca el checkbox (Ajuste R3).
      setLastRoundId(applied.forecastRoundId ?? defaultForecastRoundId(rounds))
    }
  }, [open, applied, rounds])

  const handleAplicar = () => {
    onApply(draft)
    onClose()
  }

  const handleLimpiar = () => {
    setDraft(EMPTY_COMPARISONS)
    onApply(EMPTY_COMPARISONS)
    onClose()
  }

  const toggleForecast = (checked: boolean) => {
    if (checked) {
      setDraft({ ...draft, forecastRoundId: lastRoundId ?? defaultForecastRoundId(rounds) })
    } else {
      setLastRoundId(draft.forecastRoundId)
      setDraft({ ...draft, forecastRoundId: null })
    }
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
        <input
          type="checkbox"
          checked={draft.presupuesto}
          onChange={(e) => setDraft({ ...draft, presupuesto: e.target.checked })}
          className="size-4 accent-primary"
        />
        <div>
          <div className="text-[13px] font-semibold text-foreground">Presupuesto</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Plan aprobado 2026</div>
        </div>
      </label>

      <RealesForecastCheck
        rounds={rounds}
        options={forecastOptions}
        checked={forecastChecked}
        selectedId={draft.forecastRoundId}
        onToggle={toggleForecast}
        onSelect={(id) => setDraft({ ...draft, forecastRoundId: id })}
      />

      <label className="flex cursor-pointer items-center gap-3 py-3">
        <input
          type="checkbox"
          checked={draft.anioAnterior}
          onChange={(e) => setDraft({ ...draft, anioAnterior: e.target.checked })}
          className="size-4 accent-primary"
        />
        <div>
          <div className="text-[13px] font-semibold text-foreground">Año anterior</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Comparar con 2025</div>
        </div>
      </label>
    </Drawer>
  )
}
