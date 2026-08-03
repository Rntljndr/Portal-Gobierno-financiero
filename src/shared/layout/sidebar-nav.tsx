import { useLocation } from 'react-router'
import { SidebarNavItem } from './sidebar-nav-item'
import { SidebarGastosGroup } from './sidebar-gastos-group'

const GASTOS_PREFIXES = ['/ejercicios', '/reporteria', '/reales', '/forecast']

interface SidebarNavProps {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const { pathname } = useLocation()
  const isGastosActive = GASTOS_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  return (
    <div className="flex-1 overflow-y-auto pb-2">
      {!collapsed && (
        <div className="px-[22px] pt-[18px] pb-2.5 text-[10.5px] font-semibold tracking-[0.18em] text-white/45 uppercase">
          MÓDULOS
        </div>
      )}

      <SidebarNavItem to="/" icon="dashboard" label="Inicio" active={pathname === '/'} collapsed={collapsed} />

      <SidebarGastosGroup active={isGastosActive} collapsed={collapsed} currentPath={pathname} />

      <SidebarNavItem
        to="/notificaciones"
        icon="bell"
        label="Notificaciones"
        active={pathname === '/notificaciones'}
        collapsed={collapsed}
      />

      <SidebarNavItem
        to="/reportes"
        icon="chart"
        label="Reportes"
        active={pathname === '/reportes'}
        collapsed={collapsed}
      />
    </div>
  )
}
