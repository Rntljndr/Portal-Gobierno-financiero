import { useNavigate } from 'react-router'
import { Badge, Icon, SegmentedTabs } from '@/shared/ui'
import { REALES_ULTIMO_REAL_LABEL } from '@/data/reales'

interface RealesPageHeaderProps {
  tab: 'n4' | 'n7'
  onTabChange: (t: 'n4' | 'n7') => void
}

export function RealesPageHeader({ tab, onTabChange }: RealesPageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-[10px_32px_18px]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-[26px] leading-tight font-bold tracking-tight text-primary">Reales</span>
          <Badge variant="primary">Ejercicio 2026</Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <Icon name="check" size={13} color="#067647" />
          <span>
            Último real: <strong className="text-foreground">{REALES_ULTIMO_REAL_LABEL}</strong>
          </span>
          <span className="text-border-strong">·</span>
          <span>Solo lectura · Meses cerrados: Ene → Jul</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] font-bold tracking-[0.1em] text-primary/70 uppercase">Ver</span>
        <SegmentedTabs
          value={tab}
          onChange={onTabChange}
          options={[
            { value: 'n4', label: 'Reales N4' },
            { value: 'n7', label: 'Reales N7' },
          ]}
        />
        <button
          type="button"
          onClick={() => navigate('/preliminares')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-primary hover:bg-[#F4F7FE]"
        >
          Ver preliminares
        </button>
      </div>
    </div>
  )
}
