import { useNavigate } from 'react-router'
import { Button, Icon, SegmentedTabs } from '@/shared/ui'
import type { ForecastRound } from '@/data/forecast'
import { ForecastBorradorAnterioresButton } from './forecast-borrador-anteriores-button'

interface ForecastListHeaderActionsProps {
  activo: ForecastRound | undefined
  borrador: ForecastRound | undefined
  anterioresCount: number
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
  onOpenAnteriores: () => void
  onCerrar: () => void
}

/** Tabs N4/N7 + "Nuevo Forecast" + "Borrador y Anteriores" + "Cerrar Forecast", todos en el header de
 * página (F: "Borrador y Anteriores ... en la parte superior antes del botón cerrar forecast").
 * Extraído aparte para mantener ForecastListPage bajo el límite de líneas del linter. */
export function ForecastListHeaderActions({ activo, borrador, anterioresCount, tab, onTabChange, onOpenAnteriores, onCerrar }: ForecastListHeaderActionsProps) {
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
      <ForecastBorradorAnterioresButton borrador={borrador} anterioresCount={anterioresCount} onClick={onOpenAnteriores} />
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
