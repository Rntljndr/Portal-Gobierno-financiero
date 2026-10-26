import type { IconName } from '@/shared/ui'

export interface AdminSeccion {
  label: string
  to: string
  descripcion: string
  icon: IconName
}

export interface AdminSeccionGrupo {
  label: string
  icon: IconName
  secciones: AdminSeccion[]
}

/** Mismo criterio de agrupación que `sidebar-admin-items.tsx` — se mantiene acá separado porque la
 * página de Inicio necesita además una descripción corta y un ícono propio por sección para la
 * botonera (F: "las card de cada campo deben tener un icono específico"). PEPS va dentro de su propia
 * categoría "Servicios", no como card destacada suelta. */
export const ADMIN_SECCION_GRUPOS: AdminSeccionGrupo[] = [
  {
    label: 'Servicios',
    icon: 'drives',
    secciones: [{ label: 'PEPS', to: '/administracion/peps', descripcion: 'Gestión de PEPs presupuestarios de Nivel 4.', icon: 'drives' }],
  },
  {
    label: 'Estructura organizacional',
    icon: 'dashboard',
    secciones: [
      { label: 'Países', to: '/administracion/paises', descripcion: 'Países disponibles en el sistema.', icon: 'flag' },
      { label: 'Áreas', to: '/administracion/areas', descripcion: 'Áreas de negocio y su codificación por país.', icon: 'filter' },
      { label: 'Divisiones', to: '/administracion/divisiones', descripcion: 'Divisiones y su codificación.', icon: 'view_table' },
      { label: 'Destinos', to: '/administracion/destinos', descripcion: 'Destinos y su codificación.', icon: 'arrow_right' },
      { label: 'Gerencias y Equipos', to: '/administracion/gerencias-equipos', descripcion: 'Gerencias, equipos y sus dependencias.', icon: 'view_cards' },
      { label: 'Centros de Costo', to: '/administracion/centros-costo', descripcion: 'Alta, tipo (central/directo) y habilitación.', icon: 'ceco' },
    ],
  },
  {
    label: 'Configuración financiera',
    icon: 'dollar',
    secciones: [
      { label: 'Cuentas Contables', to: '/administracion/cuentas-contables', descripcion: 'Plan de cuentas contables y su rubro.', icon: 'save' },
      { label: 'Tasas Hyperion', to: '/administracion/tasas-hyperion', descripcion: 'Tasa oficial de consolidación por país y mes.', icon: 'trendup' },
      { label: 'Fechas de cierre SAP', to: '/administracion/fechas-cierre-sap', descripcion: 'Fecha de cierre contable por país y mes.', icon: 'calendar' },
      { label: 'Ingresos', to: '/administracion/ingresos', descripcion: 'Ingresos mensuales por bandera.', icon: 'dollar' },
    ],
  },
  {
    label: 'Reglas de gestión',
    icon: 'control',
    secciones: [
      { label: 'Tipos de Solicitud', to: '/administracion/tipos-solicitud', descripcion: 'Tipos de solicitud y sus aprobadores.', icon: 'upload' },
      { label: 'Justificación de Desvío', to: '/administracion/justificacion-desvio', descripcion: 'Justificaciones disponibles para explicar desvíos.', icon: 'alert' },
    ],
  },
  {
    label: 'Seguridad y accesos',
    icon: 'lock',
    secciones: [
      { label: 'Usuarios', to: '/administracion/usuarios', descripcion: 'Usuarios del sistema, módulos y roles.', icon: 'user' },
      { label: 'Alcances y permisos', to: '/administracion/alcances-permisos', descripcion: 'Qué puede visualizar y editar cada usuario.', icon: 'eye' },
    ],
  },
]
