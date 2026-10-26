import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon, type IconName } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { SidebarTooltip } from './sidebar-tooltip'

interface AdminItem {
  label: string
  to: string
}

interface AdminGroup {
  label: string
  icon: IconName
  items: AdminItem[]
}

/** 15 ítems agrupados en 5 categorías por el tipo de dato que administran — mismo criterio que la
 * propuesta de reorganización del sidebar entregada en imagen, ahora implementado acá. PEPS va dentro
 * de su propia categoría "Servicios" (F: "PEPs debe estar dentro de la categoría de servicios"), no
 * suelto como antes. Cada categoría tiene su propio ícono (F: "Estructura organizacional el ícono que
 * tiene inicio", "Configuración financiera un ícono de finanzas", "Reglas de gestión un ícono de
 * gestión", "Seguridad y accesos un ícono de seguridad") — los ítems dentro de cada grupo mantienen el
 * ícono genérico de engranaje. */
const ADMIN_GROUPS: AdminGroup[] = [
  {
    label: 'Servicios',
    icon: 'drives',
    items: [{ label: 'PEPS', to: '/administracion/peps' }],
  },
  {
    label: 'Estructura organizacional',
    icon: 'dashboard',
    items: [
      { label: 'Países', to: '/administracion/paises' },
      { label: 'Áreas', to: '/administracion/areas' },
      { label: 'Divisiones', to: '/administracion/divisiones' },
      { label: 'Destinos', to: '/administracion/destinos' },
      { label: 'Gerencias y Equipos', to: '/administracion/gerencias-equipos' },
      { label: 'Centros de Costo', to: '/administracion/centros-costo' },
    ],
  },
  {
    label: 'Configuración financiera',
    icon: 'dollar',
    items: [
      { label: 'Cuentas Contables', to: '/administracion/cuentas-contables' },
      { label: 'Tasas Hyperion', to: '/administracion/tasas-hyperion' },
      { label: 'Fechas de cierre SAP', to: '/administracion/fechas-cierre-sap' },
      { label: 'Ingresos', to: '/administracion/ingresos' },
    ],
  },
  {
    label: 'Reglas de gestión',
    icon: 'control',
    items: [
      { label: 'Tipos de Solicitud', to: '/administracion/tipos-solicitud' },
      { label: 'Justificación de Desvío', to: '/administracion/justificacion-desvio' },
    ],
  },
  {
    label: 'Seguridad y accesos',
    icon: 'lock',
    items: [
      { label: 'Usuarios', to: '/administracion/usuarios' },
      { label: 'Alcances y permisos', to: '/administracion/alcances-permisos' },
    ],
  },
]

interface SidebarAdminGroupProps {
  group: AdminGroup
  active: boolean
  open: boolean
  onToggle: () => void
  collapsed: boolean
  currentPath: string
}

/** Mismo patrón que "Gestión de Gastos" (`sidebar-gastos-group.tsx`): header clickeable con chevron que
 * colapsa/expande, subitems indentados con borde izquierdo cuando está abierto. Con el sidebar entero
 * colapsado a íconos, el click navega al primer ítem del grupo en vez de expandir (no hay espacio para
 * mostrar subitems en modo ícono). */
function SidebarAdminGroup({ group, active, open, onToggle, collapsed, currentPath }: SidebarAdminGroupProps) {
  const navigate = useNavigate()

  return (
    <>
      <div
        className={cn(
          'group relative my-0.5 flex cursor-pointer items-center rounded-[10px] text-[13px] font-medium text-white/78 hover:bg-white/8 hover:text-white',
          collapsed ? 'mx-1.5 justify-center gap-0 px-0 py-2.5' : 'mx-3 gap-3 px-3.5 py-2.5',
          active && 'border border-white/22 bg-sidebar-active font-semibold text-white',
          active && (collapsed ? 'py-[9px]' : 'p-[9px_13px]'),
        )}
        onClick={() => (collapsed ? navigate(group.items[0].to) : onToggle())}
      >
        <Icon name={group.icon} size={16} color={active ? '#fff' : 'rgba(255,255,255,0.78)'} />
        {!collapsed && (
          <>
            <span className="flex-1">{group.label}</span>
            <Icon name={open ? 'chevron_up' : 'chevron_down'} size={12} color="rgba(255,255,255,0.6)" />
          </>
        )}
        {collapsed && <SidebarTooltip label={group.label} />}
      </div>

      {!collapsed && open && (
        <div className="ml-9 flex flex-col gap-0.5 border-l border-white/12 py-0.5 pl-3.5">
          {group.items.map((item) => (
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

interface SidebarAdminItemsProps {
  collapsed: boolean
  currentPath: string
}

/** 5 grupos colapsables (sin toggle propio del sidebar entero, la visibilidad la controla el tab
 * superior "Administración") — ver comentario en `ADMIN_GROUPS` sobre el criterio de agrupación. */
export function SidebarAdminItems({ collapsed, currentPath }: SidebarAdminItemsProps) {
  const [openGroups, setOpenGroups] = useState(() => Object.fromEntries(ADMIN_GROUPS.map((g) => [g.label, true])))

  const toggleGroup = (label: string) => setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <>
      {ADMIN_GROUPS.map((group) => (
        <SidebarAdminGroup
          key={group.label}
          group={group}
          active={group.items.some((item) => currentPath === item.to)}
          open={openGroups[group.label]}
          onToggle={() => toggleGroup(group.label)}
          collapsed={collapsed}
          currentPath={currentPath}
        />
      ))}
    </>
  )
}
