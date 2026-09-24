import { useNavigate } from 'react-router'
import { Button, Icon, SegmentedTabs } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'

interface ForecastListHeaderActionsProps {
  activo: ForecastRound | undefined
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
  onCerrar: () => void
}

/** Tabs N4/N7 + "Nuevo Forecast"/"Cerrar Forecast", ahora de nuevo en el header de página (F), a la
 * derecha de los tabs. Extraído aparte para mantener ForecastListPage bajo el límite de líneas del
 * linter. */
export function ForecastListHeaderActions({ activo, tab, onTabChange, onCerrar }: ForecastListHeaderActionsProps) {
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
      <Button
        variant="outline"
        size="sm"
        className="border-[#FECACA] text-[#B42318] hover:bg-[#FEE8E8] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        disabled={!activo}
        onClick={onCerrar}
      >
        <Icon name="x_close" size={12} color="#B42318" /> Cerrar Forecast
      </Button>
    </div>
  )
}
