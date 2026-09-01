import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

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
  const [open, setOpen] = useState(true)

  return (
    <>
      <div
        className={cn(
          'mx-3 my-0.5 flex cursor-pointer items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13px] font-medium text-white/78 hover:bg-white/8 hover:text-white',
          active && 'bg-sidebar-active border border-white/22 px-[13px] py-[9px] font-semibold text-white',
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="calendar" size={16} color={active ? '#fff' : 'rgba(255,255,255,0.78)'} />
        {!collapsed && (
          <>
            <span className="flex-1">Gestión de Gastos</span>
            <Icon name={open ? 'chevron_up' : 'chevron_down'} size={12} color="rgba(255,255,255,0.6)" />
          </>
        )}
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
