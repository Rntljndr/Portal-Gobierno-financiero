import { useNavigate } from 'react-router'
import { Button, Icon, SegmentedTabs } from '@/shared/ui'

interface ForecastListHeaderActionsProps {
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
}

/** Tabs N4/N7 + "Nuevo Forecast" en el header de página — "Borrador y Anteriores" y "Cerrar Forecast"
 * se movieron a la barra de Forecast Activo, junto a "Ver tasa de cambio" (F: "al lado izquierdo"/"al
 * lado derecho" de ese botón — ver ForecastActivoActions). Extraído aparte para mantener
 * ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListHeaderActions({ tab, onTabChange }: ForecastListHeaderActionsProps) {
  const navigate = useNavigate()

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
      <Button variant="primary" size="sm" onClick={() => navigate('/forecast/nuevo')}>
        <Icon name="plus" size={12} color="#fff" /> Nuevo Forecast
      </Button>
    </div>
  )
}
