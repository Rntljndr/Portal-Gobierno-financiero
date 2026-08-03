import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  valueSize?: 'lg' | 'md'
  icon: ReactNode
  iconBg: string
  delta?: ReactNode
}

export function KpiCard({ label, value, valueSize = 'lg', icon, iconBg, delta }: KpiCardProps) {
  return (
    <div className="rounded-[14px] border border-border bg-white p-[16px_18px_18px] transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(6,20,148,0.08)]">
      <div className="mb-1.5 flex items-start justify-between">
        <div className="max-w-[70%] text-[10px] leading-snug font-bold tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px]" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className={cn('my-1 font-extrabold tracking-tight text-foreground', valueSize === 'lg' ? 'text-[26px]' : 'text-[22px]')}>
        {value}
      </div>
      {delta && <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">{delta}</div>}
    </div>
  )
}
