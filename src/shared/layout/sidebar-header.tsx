import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import cencosudLogo from '@/assets/cencosud-logo.svg'

interface SidebarHeaderProps {
  collapsed: boolean
  onToggle: () => void
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-sidebar-border p-[22px_22px_16px]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <img src={cencosudLogo} width={26} height={15} alt="Cencosud" />
      </div>
      {!collapsed && (
        <div>
          <div className="text-sm leading-tight font-bold tracking-tight text-white">
            Gobierno
            <br />
            Financiero
          </div>
          <div className="mt-0.5 text-[10px] font-semibold tracking-[0.16em] text-white/55">PORTAL IT</div>
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        className={cn(
          'flex size-[26px] shrink-0 items-center justify-center rounded-md border border-white/18 bg-white/10 hover:bg-white/18',
          !collapsed && 'ml-auto',
        )}
      >
        <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} size={14} color="rgba(255,255,255,0.80)" />
      </button>
    </div>
  )
}
