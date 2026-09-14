import { Link, useLocation } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { TOP_TABS, getActiveTopTab } from './top-tabs'

/** Tabs del menú superior (Gestión de Gasto / Gestión de Proyectos / Solicitudes / Administración) — determinan qué sección del sidebar se muestra. */
export function TopbarTabs() {
  const { pathname } = useLocation()
  const active = getActiveTopTab(pathname)

  return (
    <div className="flex h-full flex-1 items-stretch overflow-x-auto">
      {TOP_TABS.map((tab) => (
        <Link
          key={tab.key}
          to={tab.to}
          className={cn(
            'flex shrink-0 items-center border-b-[2.5px] border-transparent px-[18px] text-[13.5px] font-medium whitespace-nowrap text-cs-gris-oscuro hover:text-primary',
            active === tab.key && 'border-b-primary font-semibold text-primary',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
