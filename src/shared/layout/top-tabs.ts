export type TopTabKey = 'gastos' | 'proyectos' | 'solicitudes' | 'admin'

interface TopTab {
  key: TopTabKey
  label: string
  to: string
}

/** Tabs del menú superior — cada uno define a qué sección de la app navega y qué determina el contenido del sidebar. */
export const TOP_TABS: TopTab[] = [
  { key: 'gastos', label: 'Gestión de Gasto', to: '/ejercicios' },
  { key: 'proyectos', label: 'Gestión de Proyectos', to: '/proyectos' },
  { key: 'solicitudes', label: 'Solicitudes', to: '/solicitudes' },
  { key: 'admin', label: 'Administración', to: '/administracion/paises' },
]

/** Determina el tab activo del menú superior a partir de la ruta actual. */
export function getActiveTopTab(pathname: string): TopTabKey {
  if (pathname.startsWith('/administracion')) return 'admin'
  if (pathname.startsWith('/proyectos')) return 'proyectos'
  if (pathname.startsWith('/solicitudes')) return 'solicitudes'
  return 'gastos'
}
