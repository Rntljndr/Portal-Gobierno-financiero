import { Drawer } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import type { ForecastRound } from '@/data/forecast'
import { useForecastStore } from '../lib/use-forecast-store'
import { TasasCambioTable } from './tasas-cambio-table'

interface ForecastTasasDrawerProps {
  open: boolean
  onClose: () => void
  round: ForecastRound
}

/** Drawer angosto solo para "Ver tasa de cambio" del Forecast Activo (F) — separado de los Datos del
 * Forecast, que ahora se ven desplegados en la propia pantalla. Usa el ancho extra (`xwide`) del
 * Drawer para que las 12 columnas de mes entren sin scroll lateral (F: "no tenga scroll lateral"). */
export function ForecastTasasDrawer({ open, onClose, round }: ForecastTasasDrawerProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const { updateTasaCambio } = useForecastStore()

  return (
    <Drawer open={open} onClose={onClose} xwide eyebrow="Forecast" title="Tasa de Cambio" subtitle={round.titulo}>
      <TasasCambioTable
        value={round.tasasCambio}
        readOnly={!isCdG}
        onChange={isCdG ? (moneda, mesIndex, valor) => updateTasaCambio(round.id, moneda, mesIndex, valor) : undefined}
      />
    </Drawer>
  )
}
