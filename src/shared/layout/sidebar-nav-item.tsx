import { Link } from 'react-router'
import { Icon, type IconName } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

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
        'mx-3 my-0.5 flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13px] font-medium text-white/78 hover:bg-white/8 hover:text-white',
        active && 'bg-sidebar-active border border-white/22 px-[13px] py-[9px] font-semibold text-white',
      )}
    >
      <Icon name={icon} size={16} color={active ? '#fff' : 'rgba(255,255,255,0.78)'} />
      {!collapsed && <span className="flex-1">{label}</span>}
    </Link>
  )
}
