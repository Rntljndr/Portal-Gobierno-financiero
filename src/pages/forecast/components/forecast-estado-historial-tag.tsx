import { Icon } from '@/shared/ui'
import type { ForecastN7Linea } from '@/data/forecast-lineas'
import { forecastEstadoVigente, FORECAST_HISTORIAL_ESTILO } from '../lib/forecast-historial'

interface ForecastEstadoHistorialTagProps {
  n7: ForecastN7Linea
  onClick: () => void
}

/** Tag seleccionable del estado del PEP (F: "el tag dice enviado... al seleccionarlo abre un drawer")
 * — reemplaza el badge estático ForecastEnvioEstadoBadge en los lugares donde además se puede abrir el
 * historial completo del PEP (ver ForecastHistorialDrawer). */
export function ForecastEstadoHistorialTag({ n7, onClick }: ForecastEstadoHistorialTagProps) {
  const estado = forecastEstadoVigente(n7)
  const estilo = FORECAST_HISTORIAL_ESTILO[estado]

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold hover:brightness-95"
      style={{ background: estilo.bg, borderColor: estilo.border, color: estilo.color }}
    >
      <Icon name={estilo.icon} size={10} color={estilo.color} />
      {estado}
    </button>
  )
}
