export type NotificationType = 'warning' | 'success' | 'info'

export interface Notification {
  id: number
  type: NotificationType
  category: string
  title: string
  message: string
  time: string
}

export const notificationCategories = ['Todas', 'Control de Gestión', 'Apertura', 'SAP', 'Sistema']

export const notifications: Notification[] = [
  {
    id: 1,
    type: 'warning',
    category: 'Control de Gestión',
    title: 'Desviación presupuestaria',
    message: 'La línea PEP-2027-007 superó el umbral de 3% de variación IPC.',
    time: 'Hace 2 horas',
  },
  {
    id: 2,
    type: 'success',
    category: 'Control de Gestión',
    title: 'Línea aprobada',
    message: 'El servicio "Mesa de ayuda nivel 1 (BPO)" fue aprobado por CdG.',
    time: 'Hace 4 horas',
  },
  {
    id: 3,
    type: 'info',
    category: 'SAP',
    title: 'Sincronización completada',
    message: 'Se actualizaron 145 registros contables desde SAP S/4HANA.',
    time: '09:30 AM',
  },
  {
    id: 4,
    type: 'info',
    category: 'Apertura',
    title: 'Ejercicio 2027 abierto',
    message: 'Tenés 12 líneas presupuestarias asignadas pendientes de revisión.',
    time: 'Ayer',
  },
  {
    id: 5,
    type: 'warning',
    category: 'Control de Gestión',
    title: 'PEP provisional vencido',
    message: 'PEP-2027-Temp-002 requiere regularización antes del cierre.',
    time: 'Ayer',
  },
  {
    id: 6,
    type: 'info',
    category: 'Sistema',
    title: 'Mantenimiento programado',
    message: 'La plataforma estará en mantenimiento el sábado de 22:00 a 23:00.',
    time: 'Hace 2 días',
  },
]
