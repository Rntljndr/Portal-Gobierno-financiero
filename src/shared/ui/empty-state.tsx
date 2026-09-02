import { Icon, type IconName } from './icon'
import { cn } from '@/shared/lib/utils'

interface EmptyStateProps {
  icon: IconName
  iconColor?: string
  title: string
  text: string
  className?: string
}

export function EmptyState({ icon, iconColor = '#8A90A2', title, text, className }: EmptyStateProps) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-border-strong bg-white p-10 text-center', className)}>
      <div className="flex justify-center">
        <Icon name={icon} size={28} color={iconColor} />
      </div>
      <div className="mt-2.5 text-[15px] font-bold text-cs-gris-oscuro">{title}</div>
      <div className="mt-1 text-[12.5px] text-muted-foreground">{text}</div>
    </div>
  )
}
