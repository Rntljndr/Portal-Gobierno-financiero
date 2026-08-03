import { recentActivity, type ActivityTone } from '@/data/dashboard'

const DOT_COLOR: Record<ActivityTone, string> = {
  info: 'bg-cs-azul',
  success: 'bg-[#1F8A5B]',
  warn: 'bg-[#B45309]',
}

export function RecentActivity() {
  return (
    <>
      <div className="mx-8 mb-3 text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">Actividad reciente</div>
      <div className="mx-8 mb-6 rounded-2xl border border-border bg-white px-4.5">
        {recentActivity.map((a, i) => (
          <div key={i} className="flex items-center gap-3.5 border-b border-border py-3 last:border-b-0">
            <span className={`size-2 shrink-0 rounded-full ${DOT_COLOR[a.tone]}`} />
            <span className="flex-1 text-[13px] text-foreground">{a.text}</span>
            <span className="text-[11.5px] text-muted-foreground">{a.time}</span>
          </div>
        ))}
      </div>
    </>
  )
}
