import { Button, Icon } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import type { ForecastRound } from '@/data/forecast'
import { ForecastAnterioresButton } from './forecast-anteriores-button'

interface ForecastActivoActionsProps {
  round: ForecastRound | undefined
  anterioresCount: number
  detalleOpen: boolean
  onToggleDetalle: () => void
  onVerTasas: () => void
  onOpenAnteriores: () => void
  onOpenConfiguraciones: () => void
  onCerrar: () => void
  /** F: en ForecastListPage, "Cerrar Forecast" (+ "Configuraciones" a su izquierda) se movieron al
   * header, al lugar de "Nuevo Forecast" — acá quedan ocultos para no duplicarlos. Las otras 2
   * pantallas que reusan esta barra (ForecastDetailPage, ForecastN7EditarTopSection) no tienen un
   * "Nuevo Forecast" con el que fusionarlos, así que ahí se mantienen sin cambios. */
  ocultarConfigCerrar?: boolean
}

/** Botonera de la barra de Forecast Activo, en este orden (F): Anteriores — Ver tasa de cambio —
 * Configuraciones (A1, solo CdG) — Cerrar Forecast — chevron de detalle. "Anteriores" no depende de
 * que haya un forecast activo, así que se muestra igual aunque no lo haya (el resto sí depende y queda
 * deshabilitado/oculto). Extraído aparte para mantener ForecastActivoCard bajo el límite de líneas
 * del linter. */
export function ForecastActivoActions({ round, anterioresCount, detalleOpen, onToggleDetalle, onVerTasas, onOpenAnteriores, onOpenConfiguraciones, onCerrar, ocultarConfigCerrar }: ForecastActivoActionsProps) {
  const { role } = useRole()
  const isCdG = role === 'cdg'
  // A4: `round` puede ser el último cerrado (fallback sin forecast activo) — Configuraciones y Cerrar
  // Forecast solo tienen sentido con uno realmente Abierto.
  const esActivo = round?.estado === 'Abierto'

  return (
    <div className="flex shrink-0 items-center gap-2">
      <ForecastAnterioresButton anterioresCount={anterioresCount} onClick={onOpenAnteriores} />
      <Button variant="outline" size="sm" disabled={!round} onClick={onVerTasas}>
        Ver tasa de cambio
      </Button>
      {!ocultarConfigCerrar && isCdG && esActivo && (
        <Button variant="outline" size="sm" onClick={onOpenConfiguraciones}>
          <Icon name="config" size={12} color="#0047B0" /> Configuraciones
        </Button>
      )}
      {!ocultarConfigCerrar && isCdG && esActivo && (
        <Button variant="primary" size="sm" className="bg-[#B42318] hover:bg-[#941d15]" onClick={onCerrar}>
          <Icon name="lock" size={12} color="#fff" /> Cerrar Forecast
        </Button>
      )}
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
