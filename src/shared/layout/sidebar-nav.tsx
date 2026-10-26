import { useLocation } from 'react-router'
import { SidebarNavItem } from './sidebar-nav-item'
import { SidebarGastosGroup } from './sidebar-gastos-group'
import { SidebarAdminItems } from './sidebar-admin-items'
import { getActiveTopTab } from './top-tabs'

const GASTOS_PREFIXES = ['/ejercicios', '/reporteria', '/reales', '/preliminares', '/forecast', '/reporte-plan', '/reporte-ejercicio-curso']

const sectionLabel = 'px-[22px] pt-[18px] pb-2.5 text-[10.5px] font-semibold tracking-[0.18em] text-white/45 uppercase'

interface SidebarNavProps {
  collapsed: boolean
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const { pathname } = useLocation()
  const tab = getActiveTopTab(pathname)

  if (tab === 'admin') {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        <SidebarNavItem to="/administracion" icon="home" label="Administración" active={pathname === '/administracion'} collapsed={collapsed} />
        {!collapsed && <div className={sectionLabel}>ADMINISTRACIÓN</div>}
        <SidebarAdminItems collapsed={collapsed} currentPath={pathname} />
      </div>
    )
  }

  if (tab === 'proyectos' || tab === 'solicitudes') {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {!collapsed && (
          <div className="px-5 pt-8 pb-4 text-center text-[12px] leading-relaxed text-white/40">
            {tab === 'proyectos' ? 'Gestión de Proyectos' : 'Solicitudes'}
            <br />
            Próximamente disponible.
          </div>
        )}
      </div>
    )
  }

  const isGastosActive = GASTOS_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-2">
      {!collapsed && <div className={sectionLabel}>MÓDULOS</div>}

      <SidebarNavItem to="/" icon="home" label="Inicio" active={pathname === '/'} collapsed={collapsed} />

      <SidebarGastosGroup active={isGastosActive} collapsed={collapsed} currentPath={pathname} />

      <SidebarNavItem to="/notificaciones" icon="bell" label="Notificaciones" active={pathname === '/notificaciones'} collapsed={collapsed} />

      <SidebarNavItem to="/reportes" icon="chart" label="Reportes" active={pathname === '/reportes'} collapsed={collapsed} />
    </div>
  )
}
