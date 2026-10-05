import { Button, Icon, SegmentedTabs } from '@/shared/ui'

interface ForecastDetailHeaderActionsProps {
  tab: 'n4' | 'n7'
  onTabChange: (tab: 'n4' | 'n7') => void
  onDescargar: () => void
  onVolver: () => void
}

/** Tabs N4/N7 + Descargar + Volver del header de un forecast anterior puntual (ForecastDetailPage) —
 * mismo patrón que ForecastListHeaderActions pero sin "Nuevo Forecast" (F: "no se puede abrir uno
 * nuevo desde allí"). */
export function ForecastDetailHeaderActions({ tab, onTabChange, onDescargar, onVolver }: ForecastDetailHeaderActionsProps) {
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
      <Button variant="outline" size="sm" onClick={onDescargar}>
        <Icon name="download" size={12} color="#0047B0" /> Descargar
      </Button>
      <Button variant="outline" size="sm" onClick={onVolver}>
        ← Volver
      </Button>
    </div>
  )
}
