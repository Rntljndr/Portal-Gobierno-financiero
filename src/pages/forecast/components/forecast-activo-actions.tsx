import { Button, Icon } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { ForecastBorradorAnterioresButton } from './forecast-borrador-anteriores-button'

interface ForecastActivoActionsProps {
  round: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anterioresCount: number
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onCerrar: () => void
}

/** Botonera de la barra de Forecast Activo, en este orden (F): Borrador y Anteriores — Ver tasa de
 * cambio — Cerrar Forecast — chevron de detalle. "Borrador y Anteriores" no depende de que haya un
 * forecast activo, así que se muestra igual aunque no lo haya (los otros tres si dependen y quedan
 * deshabilitados/ocultos). Extraído aparte para mantener ForecastActivoCard bajo el límite de líneas
 * del linter. */
export function ForecastActivoActions({ round, borrador, anterioresCount, detalleOpen, onToggleDetalle, onVerTasas, onOpenAnteriores, onCerrar }: ForecastActivoActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <ForecastBorradorAnterioresButton borrador={borrador} anterioresCount={anterioresCount} onClick={onOpenAnteriores} />
      <Button variant="outline" size="sm" disabled={!round} onClick={onVerTasas}>
        Ver tasa de cambio
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        disabled={!round}
        onClick={onCerrar}
      >
        <Icon name="x_close" size={12} color="#B42318" /> Cerrar Forecast
      </Button>
      {round && (
        <button
          type="button"
          onClick={onToggleDetalle}
          aria-label={detalleOpen ? 'Ocultar detalle' : 'Ver detalle'}
          title={detalleOpen ? 'Ocultar detalle' : 'Ver detalle'}
          className="flex size-8 items-center justify-center rounded-lg border border-border-strong hover:bg-surface-hover"
        >
          <Icon name={detalleOpen ? 'chevron_up' : 'chevron_down'} size={16} color="#0047B0" />
        </button>
      )}
    </div>
  )
}
