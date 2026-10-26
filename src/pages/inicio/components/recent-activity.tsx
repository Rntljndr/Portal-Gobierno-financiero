import { recentActivity, type ActivityTone } from '@/data/dashboard'
import { Card } from '@/shared/ui'

const DOT_COLOR: Record<ActivityTone, string> = {
  info: 'bg-primary',
  success: 'bg-success',
  warn: 'bg-warning',
}

export function RecentActivity() {
  return (
    <Card padding="md" className="py-0">
      {recentActivity.map((a, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-border-table py-3 last:border-b-0">
          <span className={`size-2 shrink-0 rounded-full ${DOT_COLOR[a.tone]}`} />
          <span className="flex-1 text-sm text-foreground">{a.text}</span>
          <span className="text-xs text-muted-foreground">{a.time}</span>
        </div>
      ))}
    </Card>
  )
}
