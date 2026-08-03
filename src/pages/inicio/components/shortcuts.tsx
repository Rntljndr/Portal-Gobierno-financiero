import { useNavigate } from 'react-router'
import { Icon, type IconName } from '@/shared/ui'

const SHORTCUTS: { to: string; icon: IconName; title: string; sub: string }[] = [
  { to: '/ejercicios', icon: 'ejercicios', title: 'Ejercicios', sub: 'Tus ejercicios actuales y anteriores' },
  { to: '/reales', icon: 'chart', title: 'Reales', sub: 'Ejecución contable desde SAP' },
  { to: '/forecast', icon: 'trendup', title: 'Forecast', sub: 'Proyecciones y escenarios' },
]

export function DashboardShortcuts() {
  const navigate = useNavigate()

  return (
    <>
      <div className="mx-8 mb-3 text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">Atajos rápidos</div>
      <div className="mx-8 mb-5.5 grid grid-cols-3 gap-3.5">
        {SHORTCUTS.map((s) => (
          <button
            key={s.to}
            type="button"
            onClick={() => navigate(s.to)}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-white p-[16px_18px] text-left transition-all hover:-translate-y-px hover:border-primary hover:shadow-[0_8px_20px_rgba(6,20,148,0.08)]"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF1FB]">
              <Icon name={s.icon} size={20} color="#0047B0" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-primary">{s.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
            </div>
            <Icon name="chevron_right" size={14} color="#8A90A2" />
          </button>
        ))}
      </div>
    </>
  )
}
