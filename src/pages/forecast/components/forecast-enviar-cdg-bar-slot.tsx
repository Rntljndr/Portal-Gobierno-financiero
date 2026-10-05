import type { useForecastListSeleccion } from '../lib/use-forecast-seleccion'
import type { ForecastEnvioTransicion } from '../lib/forecast-envio'
import { ForecastEnviarCdgBar } from './forecast-enviar-cdg-bar'

interface EnviarCdgBarSlotProps {
  show: boolean
  roundId: string | undefined
  seleccionActiva: ReturnType<typeof useForecastListSeleccion>['seleccionActiva']
  onAplicar: (roundId: string, transicion: ForecastEnvioTransicion, seleccion: Set<string>) => void
}

/** Barra "Enviar a Control de Gestión" bajo la tabla — solo si esta tabla ofrece selección múltiple.
 * Extraída de forecast-list-body.tsx para mantenerlo bajo el límite de líneas del linter. */
export function EnviarCdgBarSlot({ show, roundId, seleccionActiva, onAplicar }: EnviarCdgBarSlotProps) {
  if (!show || !roundId) return null
  return (
    <ForecastEnviarCdgBar
      count={seleccionActiva.seleccion.size}
      onAplicar={(transicion) => {
        onAplicar(roundId, transicion, seleccionActiva.seleccion)
        seleccionActiva.clear()
      }}
    />
  )
}
