import { Link } from 'react-router'
import { Icon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { SidebarTooltip } from './sidebar-tooltip'

interface AdminItem {
  label: string
  to: string
}

const ADMIN_ITEMS: AdminItem[] = [
  { label: 'Países', to: '/administracion/paises' },
  { label: 'Áreas', to: '/administracion/areas' },
  { label: 'Divisiones', to: '/administracion/divisiones' },
  { label: 'Cuentas Contables', to: '/administracion/cuentas-contables' },
  { label: 'Destinos', to: '/administracion/destinos' },
  { label: 'Gerencias y Equipos', to: '/administracion/gerencias-equipos' },
  { label: 'Tipos de Solicitud', to: '/administracion/tipos-solicitud' },
  { label: 'PEPS', to: '/administracion/peps' },
  { label: 'Ingresos', to: '/administracion/ingresos' },
]

interface SidebarAdminItemsProps {
  collapsed: boolean
  currentPath: string
}

/** Lista plana de las 8 secciones de Administración — sin toggle propio, la visibilidad la controla el tab superior "Administración". */
export function SidebarAdminItems({ collapsed, currentPath }: SidebarAdminItemsProps) {
  return (
    <>
      {ADMIN_ITEMS.map((item) => {
        const active = item.to === '/administracion/peps' ? currentPath.startsWith('/administracion/peps') : currentPath === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'group relative my-0.5 flex items-center rounded-[10px] text-[13px] font-medium text-white/78 hover:bg-white/8 hover:text-white',
              collapsed ? 'mx-1.5 justify-center gap-0 px-0 py-2.5' : 'mx-3 gap-3 px-3.5 py-2.5',
              active && 'border border-white/22 bg-sidebar-active font-semibold text-white',
              active && (collapsed ? 'py-[9px]' : 'p-[9px_13px]'),
            )}
          >
            <Icon name="config" size={16} color={active ? '#fff' : 'rgba(255,255,255,0.78)'} />
            {!collapsed && <span className="flex-1">{item.label}</span>}
            {collapsed && <SidebarTooltip label={item.label} />}
          </Link>
        )
      })}
    </>
  )
}
