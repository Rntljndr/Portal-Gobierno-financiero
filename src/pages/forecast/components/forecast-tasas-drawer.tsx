import { Drawer } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { TasasCambioTable } from './tasas-cambio-table'

interface ForecastTasasDrawerProps {
  open: boolean
  onClose: () => void
  round: ForecastRound
}

/** Drawer de "Ver tasa de cambio" (A1: solo lectura, visible para todos los usuarios y en todos los
 * forecast, activos y anteriores) — editarlas vive únicamente en "Configuraciones"
 * (forecast-configuraciones-drawer.tsx), solo para Control de Gestión y solo en el forecast activo.
 * Usa el ancho extra (`xwide`) del Drawer para que las 12 columnas de mes entren sin scroll lateral. */
export function ForecastTasasDrawer({ open, onClose, round }: ForecastTasasDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} xwide eyebrow="Forecast" title="Tasa de Cambio" subtitle={round.titulo}>
      <TasasCambioTable value={round.tasasCambio} readOnly soloHistorico={round.estado === 'Cerrado'} />
    </Drawer>
  )
}
