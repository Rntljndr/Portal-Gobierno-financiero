import { useEffect, useState } from 'react'
import { Drawer, Spinner } from '@/shared/ui'
import { useForecastStore } from '@/pages/forecast/lib/use-forecast-store'
import { EMPTY_COMPARISONS, type Comparisons } from '../lib/comparisons'
import { defaultForecastRoundId, forecastComparisonOptions } from '../lib/forecast-comparison'
import { RealesForecastCheck } from './reales-forecast-check'
import { RealesCompareCheck } from './reales-compare-check'
import { RealesCompareFooter } from './reales-compare-footer'

interface RealesComparisonDrawerProps {
  open: boolean
  onClose: () => void
  applied: Comparisons
  onApply: (next: Comparisons) => void
}

/** Ajuste R2: la comparativa no se precarga — se consulta recién al presionar Aplicar, con el drawer bloqueado mientras "responde el servidor". */
const APPLY_DELAY_MS = 700

export function RealesComparisonDrawer({ open, onClose, applied, onApply }: RealesComparisonDrawerProps) {
  const [draft, setDraft] = useState<Comparisons>(applied)
  const [lastRoundId, setLastRoundId] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const { rounds } = useForecastStore()
  const forecastOptions = forecastComparisonOptions(rounds)
  const forecastChecked = draft.forecastRoundId !== null

  useEffect(() => {
    if (open) {
      setDraft(applied)
      setApplying(false)
      // El forecast activo (último cerrado) queda listo para elegir apenas se marca el checkbox.
      setLastRoundId(applied.forecastRoundId ?? defaultForecastRoundId(rounds))
    }
  }, [open, applied, rounds])

  const handleAplicar = () => {
    setApplying(true)
    setTimeout(() => {
      onApply(draft)
      setApplying(false)
      onClose()
    }, APPLY_DELAY_MS)
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
      closeDisabled={applying}
      footer={<RealesCompareFooter applying={applying} onLimpiar={handleLimpiar} onAplicar={handleAplicar} />}
    >
      <fieldset disabled={applying} className="contents">
        <RealesCompareCheck
          label="Presupuesto"
          hint="Plan aprobado 2026"
          checked={draft.presupuesto}
          onChange={(v) => setDraft({ ...draft, presupuesto: v })}
        />

        <RealesForecastCheck
          rounds={rounds}
          options={forecastOptions}
          checked={forecastChecked}
          selectedId={draft.forecastRoundId}
          onToggle={toggleForecast}
          onSelect={(id) => setDraft({ ...draft, forecastRoundId: id })}
        />

        <RealesCompareCheck
          label="Año anterior"
          hint="Comparar con 2025"
          checked={draft.anioAnterior}
          onChange={(v) => setDraft({ ...draft, anioAnterior: v })}
          border={false}
        />
      </fieldset>

      {applying && (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-border bg-[#F8F9FD] p-3 text-[12.5px] text-cs-gris-oscuro">
          <Spinner size={4} /> Consultando comparativa en el servidor...
        </div>
      )}
    </Drawer>
  )
}
