import { Badge, Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { formatFechaCorta } from '../lib/format-date'

interface ForecastActivoMiniCardProps {
  activo: ForecastRound
  /** Botón "Ir" — navega al forecast activo real. Se muestra en toda vista donde aparece esta card
   * (F: "esta card debe estar en todos los niveles... debe tener un botón de ir"), para que el usuario
   * nunca pierda de referencia cuál es el activo y pueda volver a él en un clic. */
  onIr?: () => void
}

/** Card con nombre y fecha del forecast activo — usada tanto arriba de "Buscar forecasts anteriores"
 * (ForecastAnterioresDrawer) como en toda vista de un forecast anterior/cerrado. F: "misma estructura
 * que las card inferiores" (ForecastAnteriorCard) — nombre + tag de tipo en la fila superior, fechas de
 * inicio/fin debajo, acción a la derecha. */
export function ForecastActivoMiniCard({ activo, onIr }: ForecastActivoMiniCardProps) {
  return (
    <div className="mb-4 rounded-lg border border-primary/30 bg-[#F7FAFF] px-3 py-2.5">
      <div className="text-[10px] font-bold tracking-[0.04em] text-primary/70 uppercase">Forecast activo</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-foreground">{activo.titulo}</span>
            <Badge variant="primary">{activo.tipo === 'global' ? 'Global' : 'Parcial'}</Badge>
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            Inicio: {formatFechaCorta(activo.fechaInicio)} — Fin: {formatFechaCorta(activo.fechaTermino)}
          </div>
        </div>
        {onIr && (
          <Button variant="outline" size="sm" onClick={onIr}>
            <Icon name="arrow_right" size={12} color="#0047B0" /> Ir
          </Button>
        )}
      </div>
    </div>
  )
}
