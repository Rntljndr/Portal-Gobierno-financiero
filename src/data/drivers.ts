export type EstadoProceso = 'preliminar' | 'borrador' | 'enviado' | 'rechazado'

export interface DriverRow {
  id: number
  nombre: string
  responsable: string
  equipo: string
  gerencia: string
  descripcion: string
  estadoProc: EstadoProceso
  ultEditor: string
  ultEdicion: string
  distribucion: boolean
  nuevo: boolean
}

export const drivers: DriverRow[] = [
  { id: 1, nuevo: true, nombre: 'Digital Factory Driver 16', responsable: 'aprotti', equipo: 'Digital Factory', descripcion: 'Headcount Digital Factory por bandera regional.', estadoProc: 'borrador', ultEditor: 'aprotti', ultEdicion: '03/01/2026 23:00', gerencia: 'Tecnología & Digital', distribucion: false },
  { id: 2, nuevo: false, nombre: 'Drivers de CGOI007398', responsable: 'ccarballo', equipo: 'BO Gerencia', descripcion: 'Distribución de costos Gerencia IT Business Services.', estadoProc: 'enviado', ultEditor: 'ccarballo', ultEdicion: '02/05/2025 23:00', gerencia: 'Administración & Finanzas', distribucion: true },
  { id: 3, nuevo: false, nombre: 'Drivers de PGOI007381', responsable: 'lohaner', equipo: 'SM PER', descripcion: 'Drivers asociados al CdC PGOI007381 — Perú.', estadoProc: 'preliminar', ultEditor: 'lohaner', ultEdicion: '02/05/2025 23:00', gerencia: 'Operaciones Retail', distribucion: false },
  { id: 4, nuevo: false, nombre: 'Datacenter Argentina (Housing)', responsable: 'fusiars', equipo: 'ENGINEERING OPERATION CORE', descripcion: 'Housing del datacenter Argentina — distribución mensual.', estadoProc: 'enviado', ultEditor: 'fusiars', ultEdicion: '21/08/2025 16:43', gerencia: 'Tecnología & Digital', distribucion: true },
  { id: 5, nuevo: false, nombre: 'Drivers de AGOI007303', responsable: 'lasoria', equipo: 'IS Management', descripcion: 'Drivers de Seguridad de la Información.', estadoProc: 'rechazado', ultEditor: 'lasoria', ultEdicion: '02/05/2025 23:00', gerencia: 'Riesgo & Compliance', distribucion: true },
  { id: 6, nuevo: true, nombre: 'Digital Factory Driver 23', responsable: 'aprotti', equipo: 'Digital Factory', descripcion: 'Headcount Digital Factory — equipo Data.', estadoProc: 'borrador', ultEditor: 'aprotti', ultEdicion: '03/01/2026 23:00', gerencia: 'Tecnología & Digital', distribucion: true },
  { id: 7, nuevo: false, nombre: 'Ordenes de Compra Soles Order v2', responsable: 'crivarosd', equipo: 'Otros', descripcion: 'OCs en soles — orden v2.', estadoProc: 'preliminar', ultEditor: 'eli5198', ultEdicion: '02/05/2025 23:00', gerencia: 'Administración & Finanzas', distribucion: false },
  { id: 8, nuevo: false, nombre: 'Eficiencia', responsable: 'yvecchio', equipo: 'Gerencia', descripcion: 'Driver de eficiencia operativa — corp.', estadoProc: 'preliminar', ultEditor: 'cnavarro', ultEdicion: '02/05/2025 23:00', gerencia: 'Servicios Compartidos', distribucion: false },
  { id: 9, nuevo: true, nombre: 'Digital Factory Driver 41', responsable: 'aprotti', equipo: 'Digital Factory', descripcion: 'Headcount Digital Factory — squad Onboarding.', estadoProc: 'enviado', ultEditor: 'aprotti', ultEdicion: '03/01/2026 23:00', gerencia: 'Tecnología & Digital', distribucion: true },
]

export const estadoProcesoLabel: Record<EstadoProceso, string> = {
  preliminar: 'Preliminar',
  borrador: 'Borrador',
  enviado: 'Enviado',
  rechazado: 'Rechazado',
}
