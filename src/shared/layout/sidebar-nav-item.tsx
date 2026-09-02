import { Link } from 'react-router'
import { Icon, type IconName } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { SidebarTooltip } from './sidebar-tooltip'

interface SidebarNavItemProps {
  to: string
  icon: IconName
  label: string
  active: boolean
  collapsed: boolean
}

export function SidebarNavItem({ to, icon, label, active, collapsed }: SidebarNavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative my-0.5 flex items-center rounded-[10px] text-[13px] font-medium text-white/78 hover:bg-white/8 hover:text-white',
        collapsed ? 'mx-1.5 justify-center gap-0 px-0 py-2.5' : 'mx-3 gap-3 px-3.5 py-2.5',
        active && 'border border-white/22 bg-sidebar-active font-semibold text-white',
        active && (collapsed ? 'py-[9px]' : 'p-[9px_13px]'),
      )}
    >
      <Icon name={icon} size={16} color={active ? '#fff' : 'rgba(255,255,255,0.78)'} />
      {!collapsed && <span className="flex-1">{label}</span>}
      {collapsed && <SidebarTooltip label={label} />}
    </Link>
  )
}
