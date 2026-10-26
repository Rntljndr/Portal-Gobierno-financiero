import { Icon, type IconName } from './icon'
import { cn } from '@/shared/lib/utils'

interface EmptyStateProps {
  icon: IconName
  iconColor?: string
  title: string
  text: string
  className?: string
}

export function EmptyState({ icon, iconColor = 'var(--color-muted-foreground)', title, text, className }: EmptyStateProps) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-border-strong bg-white p-10 text-center', className)}>
      <div className="flex justify-center" style={{ color: iconColor }}>
        <Icon name={icon} size={28} color="currentColor" />
      </div>
      <div className="mt-3 text-base font-bold text-cs-gris-oscuro">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{text}</div>
    </div>
  )
}
