import { useLocation } from 'react-router'

export type BreadcrumbOrigin = 'reportes'

interface BreadcrumbOriginState {
  from?: BreadcrumbOrigin
}

/** Algunas pantallas son accesibles desde más de un lugar (ej. el módulo Reportes además de su
 * ubicación habitual bajo Gestión de Gastos); el breadcrumb debe reflejar por dónde entró el
 * usuario, no una ruta fija. El origen viaja en el `state` de la navegación (ver `navigate(to,
 * { state: { from: 'reportes' } })`) y se pierde solo si se entra por URL directa, en cuyo caso se
 * usa el breadcrumb por defecto de la pantalla. */
export function useBreadcrumbFrom(): BreadcrumbOrigin | undefined {
  const location = useLocation()
  return (location.state as BreadcrumbOriginState | null)?.from
}
