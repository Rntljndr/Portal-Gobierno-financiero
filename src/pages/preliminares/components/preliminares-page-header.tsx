import { Badge, SegmentedTabs } from '@/shared/ui'
import { PRELIM_CIERRE_DATE, PRELIM_DIAS_FALTAN, PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { CierreIndicator } from './cierre-indicator'

interface PreliminaresPageHeaderProps {
  tab: 'n4' | 'n7'
  onTabChange: (t: 'n4' | 'n7') => void
}

export function PreliminaresPageHeader({ tab, onTabChange }: PreliminaresPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[26px] leading-tight font-bold tracking-tight text-primary">Preliminares</span>
          <Badge variant="primary">{PRELIM_MES_OPEN_LABEL}</Badge>
        </div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">Mes abierto: <strong className="font-semibold text-foreground">{PRELIM_MES_OPEN_LABEL}</strong> · registro de costos preliminares</div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <CierreIndicator dias={PRELIM_DIAS_FALTAN} fecha={PRELIM_CIERRE_DATE} />
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
