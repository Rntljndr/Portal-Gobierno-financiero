import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { SidebarTooltip } from './sidebar-tooltip'

interface GastosItem {
  label: string
  to: string
}

const GASTOS_ITEMS: GastosItem[] = [
  { label: 'Ejercicios', to: '/ejercicios' },
  { label: 'Reportería', to: '/reporteria' },
  { label: 'Forecast', to: '/forecast' },
  { label: 'Reales', to: '/reales' },
  { label: 'Preliminares', to: '/preliminares' },
]

interface SidebarGastosGroupProps {
  active: boolean
  collapsed: boolean
  currentPath: string
}

export function SidebarGastosGroup({ active, collapsed, currentPath }: SidebarGastosGroupProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  return (
    <>
      <div
        className={cn(
          'group relative my-0.5 flex cursor-pointer items-center rounded-[10px] text-[13px] font-medium text-white/78 hover:bg-white/8 hover:text-white',
          collapsed ? 'mx-1.5 justify-center gap-0 px-0 py-2.5' : 'mx-3 gap-3 px-3.5 py-2.5',
          active && 'border border-white/22 bg-sidebar-active font-semibold text-white',
          active && (collapsed ? 'py-[9px]' : 'p-[9px_13px]'),
        )}
        onClick={() => (collapsed ? navigate(GASTOS_ITEMS[0].to) : setOpen((v) => !v))}
      >
        <Icon name="calendar" size={16} color={active ? '#fff' : 'rgba(255,255,255,0.78)'} />
        {!collapsed && (
          <>
            <span className="flex-1">Gestión de Gastos</span>
            <Icon name={open ? 'chevron_up' : 'chevron_down'} size={12} color="rgba(255,255,255,0.6)" />
          </>
        )}
        {collapsed && <SidebarTooltip label="Gestión de Gastos" />}
      </div>

      {!collapsed && open && (
        <div className="ml-9 flex flex-col gap-0.5 border-l border-white/12 py-0.5 pl-3.5">
          {GASTOS_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'mx-2 my-px rounded-lg px-3 py-1.5 text-[12.5px] text-white/70',
                currentPath === item.to && 'border border-white/22 bg-white/12 py-[6px] font-semibold text-white',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
