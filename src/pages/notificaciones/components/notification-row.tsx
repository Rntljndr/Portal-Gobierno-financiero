import { Icon } from '@/shared/ui'
import type { Notification } from '@/data/notifications'

const TONE: Record<Notification['type'], { icon: 'alert' | 'check' | 'info'; color: string; bg: string }> = {
  warning: { icon: 'alert', color: '#B45309', bg: '#FFF4E0' },
  success: { icon: 'check', color: '#067647', bg: '#E1FBEF' },
  info: { icon: 'info', color: '#0047B0', bg: '#E8EEFB' },
}

export function NotificationRow({ notification }: { notification: Notification }) {
  const tone = TONE[notification.type]

  return (
    <div className="flex items-start gap-3.5 border-b border-[#F1F4FA] p-[18px_22px] transition-colors last:border-b-0 hover:bg-[#FAFBFE]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full" style={{ background: tone.bg }}>
        <Icon name={tone.icon} size={16} color={tone.color} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-3">
          <div>
            <div className="text-[10.5px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
              {notification.category}
            </div>
            <div className="mt-0.5 text-sm font-bold text-foreground">{notification.title}</div>
          </div>
          <div className="shrink-0 text-[11.5px] whitespace-nowrap text-muted-foreground">{notification.time}</div>
        </div>
        <div className="mt-1 text-[12.5px] leading-normal text-cs-gris-oscuro">{notification.message}</div>
      </div>
      <button
        type="button"
        aria-label="Más opciones"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-[#F1F4FA] hover:text-cs-gris-oscuro"
      >
        <Icon name="dots" size={14} color="currentColor" />
      </button>
    </div>
  )
}
