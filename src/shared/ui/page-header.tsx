import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-5 p-[10px_32px_20px]">
      <div>
        <div className="text-[26px] leading-tight font-bold tracking-tight text-primary">{title}</div>
        {subtitle && <div className="mt-1 text-[13px] text-muted-foreground">{subtitle}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2.5">{action}</div>}
    </div>
  )
}
