import { useNavigate } from 'react-router'
import { Button, Icon, SegmentedTabs } from '@/shared/ui'
import { useRole } from '@/shared/context/use-role'
import { FORECAST_NUEVO_SIN_ACTIVO } from '../lib/forecast-config'
import { ForecastConfigCerrarButtons } from './forecast-config-cerrar-buttons'

interface ForecastListHeaderActionsProps {
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
  hasActivo: boolean
  /** F: "el botón de cerrar forecast debe estar en el lugar del botón de nuevo forecast" — con un
   * forecast activo, este mismo espacio muestra Configuraciones + Cerrar Forecast (en vez de "Nuevo
   * Forecast"); al cerrarlo, vuelve a mostrar "Nuevo Forecast" para abrir uno nuevo acá mismo. */
  onOpenConfiguraciones: () => void
  onCerrar: () => void
}

/** Tabs N4/N7 + el botón de la derecha, que alterna entre "Nuevo Forecast" (sin uno activo) y
 * "Configuraciones" + "Cerrar Forecast" (con uno activo, solo CdG) — F: "el botón de configuraciones
 * debe ir al lado izquierdo de cerrar forecast". "Anteriores"/"Ver tasa de cambio" siguen en la barra
 * de Forecast Activo (ver ForecastActivoActions). "Nuevo Forecast" (A2) solo se habilita cuando no hay
 * ningún forecast abierto; si hay uno activo pero el usuario no es CdG, FORECAST_NUEVO_SIN_ACTIVO
 * decide si "Nuevo Forecast" se ve deshabilitado (con tooltip) o se oculta directamente — acá no
 * aplica, porque ese caso ya muestra Configuraciones/Cerrar Forecast en su lugar si es CdG, o nada si
 * no lo es. Extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListHeaderActions({ tab, onTabChange, hasActivo, onOpenConfiguraciones, onCerrar }: ForecastListHeaderActionsProps) {
  const navigate = useNavigate()
  const { role } = useRole()
  const isCdG = role === 'cdg'
  const ocultarNuevo = hasActivo && FORECAST_NUEVO_SIN_ACTIVO === 'hidden'

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-bold tracking-[0.1em] text-primary/70 uppercase">Ver</span>
      <SegmentedTabs
        value={tab}
        onChange={onTabChange}
        options={[
          { value: 'n4', label: 'Forecast N4' },
          { value: 'n7', label: 'Forecast N7' },
        ]}
      />
      {hasActivo
        ? isCdG && <ForecastConfigCerrarButtons onOpenConfiguraciones={onOpenConfiguraciones} onCerrar={onCerrar} />
        : !ocultarNuevo && (
            <Button variant="primary" size="sm" onClick={() => navigate('/forecast/nuevo')}>
              <Icon name="plus" size={12} color="#fff" /> Nuevo Forecast
            </Button>
          )}
    </div>
  )
}
