export type ActivityTone = 'info' | 'success' | 'warn'

export interface ActivityItem {
  tone: ActivityTone
  text: string
  time: string
}

export const recentActivity: ActivityItem[] = [
  { tone: 'info', text: 'Apertura de Ejercicio 2027 · 12 líneas asignadas', time: 'Hoy · 09:30' },
  { tone: 'success', text: 'Servicio "Mesa de ayuda nivel 1 (BPO)" fue aprobado por CdG', time: 'Ayer · 16:48' },
  { tone: 'warn', text: 'PEP-2027-007 requiere revisión: variación IPC > 3%', time: '21 mar · 14:12' },
  { tone: 'info', text: 'Sincronización SAP completada · 145 registros', time: '21 mar · 09:30' },
]

export const heroSummary = {
  pendientes: 7,
  enviados: 3,
  aprobados: 2,
  montoTotal: 'CLP 142.3M',
}
