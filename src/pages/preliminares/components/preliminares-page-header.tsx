import { Badge, SegmentedTabs } from '@/shared/ui'
import { CierreIndicator } from './cierre-indicator'

interface PreliminaresPageHeaderProps {
  tab: 'n4' | 'n7'
  onTabChange: (t: 'n4' | 'n7') => void
  mesAbierto: string
}

export function PreliminaresPageHeader({ tab, onTabChange, mesAbierto }: PreliminaresPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[26px] leading-tight font-bold tracking-tight text-primary">Preliminares</span>
          <Badge variant="primary">{mesAbierto}</Badge>
        </div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">Mes abierto: <strong className="font-semibold text-foreground">{mesAbierto}</strong> · registro de costos preliminares</div>
        <div className="mt-1 text-xs font-medium text-muted-foreground">Última sincronización SAP: hoy 02:00 AM</div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <CierreIndicator mesAbierto={mesAbierto} />
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold tracking-[0.1em] text-primary/70 uppercase">Ver</span>
          <SegmentedTabs
            value={tab}
            onChange={onTabChange}
            options={[
              { value: 'n4', label: 'Preliminares N4' },
              { value: 'n7', label: 'Preliminares N7' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
