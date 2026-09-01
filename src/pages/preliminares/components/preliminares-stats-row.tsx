import { Icon } from '@/shared/ui'

interface StatProps {
  icon: 'view_table' | 'check' | 'lock'
  iconBg: string
  iconColor: string
  label: string
  value: number
  meta: string
}

function Stat({ icon, iconBg, iconColor, label, value, meta }: StatProps) {
  return (
    <div className="flex flex-1 items-center gap-2.5 p-[12px_16px]">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: iconBg }}>
        <Icon name={icon} size={16} color={iconColor} />
      </div>
      <div>
        <div className="mb-0.5 text-[10px] font-bold tracking-[0.07em] text-muted-foreground uppercase">{label}</div>
        <div className="text-[17px] leading-none font-extrabold tabular-nums text-foreground">{value}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground">{meta}</div>
      </div>
    </div>
  )
}

interface PreliminaresStatsRowProps {
  totalServicio: number
  conPrelim: number
  definitivos: number
}

export function PreliminaresStatsRow({ totalServicio, conPrelim, definitivos }: PreliminaresStatsRowProps) {
  return (
    <div className="mx-8 mb-5.5 flex divide-x divide-border overflow-hidden rounded-xl border border-border bg-white">
      <Stat icon="view_table" iconBg="rgba(0,71,176,0.10)" iconColor="#0047B0" label="Servicios N4" value={totalServicio} meta="en este período" />
      <Stat icon="check" iconBg="#ECFDF3" iconColor="#067647" label="Con Preliminar" value={conPrelim} meta={`de ${totalServicio} servicios`} />
      <Stat icon="lock" iconBg={definitivos > 0 ? '#EEF4FF' : '#F4F6FB'} iconColor={definitivos > 0 ? '#0047B0' : '#8A90A2'} label="Definitivos" value={definitivos} meta="fijados por CdG" />
    </div>
  )
}
