import { Badge } from '@/shared/ui'
import type { ForecastEnvioEstado } from '@/data/forecast-lineas'

function enviado(estado: ForecastEnvioEstado): boolean {
  return estado === 'Enviado a CG' || estado === 'Validado por Control de Gestión'
}

/** Columna "Estado" de los PEP N7 (F: "al lado de la llave de distribución") — dos estados nomás,
 * Enviado (verde) o No enviado (gris), sin distinguir Validado/Rechazado acá: ese detalle ya lo dan
 * las columnas de Desvío/Justificación y el badge "Edición manual". */
export function ForecastEnvioEstadoBadge({ estado }: { estado: ForecastEnvioEstado }) {
  return <Badge variant={enviado(estado) ? 'success' : 'neutral'}>{enviado(estado) ? 'Enviado' : 'No enviado'}</Badge>
}
