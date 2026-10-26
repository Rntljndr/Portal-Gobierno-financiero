import { REALES_LAST_CLOSED } from '../reales'

/** Reporte Ejercicio en Curso v3 — catálogo del gasto OPEX IT. Solo usa las dimensiones del enunciado:
 * país, negocio (bandera), gerencia/equipo, rubro, cuenta contable, servicio y responsable de cuenta. */

export const V3_EJERCICIO = 2026
export const V3_MESES_CERRADOS = REALES_LAST_CLOSED
export const V3_MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const V3_MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
/** "jul-2026" */
export const V3_CORTE_CORTO = `${V3_MESES[V3_MESES_CERRADOS - 1].toLowerCase()}-${V3_EJERCICIO}`

export type V3Pais = 'Chile' | 'Argentina' | 'Perú' | 'Colombia' | 'Brasil'
export const V3_PAISES: V3Pais[] = ['Chile', 'Argentina', 'Perú', 'Colombia', 'Brasil']

/** Negocios por país con su venta anual plan (USD MM) — la venta es dato de ejemplo (fuente pendiente). */
export const V3_NEGOCIOS: { pais: V3Pais; negocio: string; ventaAnualMM: number }[] = [
  { pais: 'Chile', negocio: 'Jumbo', ventaAnualMM: 3900 },
  { pais: 'Chile', negocio: 'Santa Isabel', ventaAnualMM: 1700 },
  { pais: 'Chile', negocio: 'Paris', ventaAnualMM: 1500 },
  { pais: 'Chile', negocio: 'Easy', ventaAnualMM: 900 },
  { pais: 'Argentina', negocio: 'Jumbo', ventaAnualMM: 1100 },
  { pais: 'Argentina', negocio: 'Disco', ventaAnualMM: 800 },
  { pais: 'Argentina', negocio: 'Easy', ventaAnualMM: 600 },
  { pais: 'Perú', negocio: 'Wong', ventaAnualMM: 700 },
  { pais: 'Perú', negocio: 'Metro', ventaAnualMM: 1100 },
  { pais: 'Colombia', negocio: 'Jumbo', ventaAnualMM: 650 },
  { pais: 'Colombia', negocio: 'Metro', ventaAnualMM: 450 },
  { pais: 'Colombia', negocio: 'Easy', ventaAnualMM: 300 },
  { pais: 'Brasil', negocio: 'GBarbosa', ventaAnualMM: 1300 },
  { pais: 'Brasil', negocio: 'Bretas', ventaAnualMM: 900 },
]

/** División de cada bandera (para el mapa de calor país × división de la Visión Negocio). */
export const V3_DIVISIONES = ['Supermercados', 'Mejoramiento del hogar', 'Tiendas por departamento'] as const
export type V3Division = (typeof V3_DIVISIONES)[number]
export const divisionDe = (negocio: string): V3Division => (negocio === 'Easy' ? 'Mejoramiento del hogar' : negocio === 'Paris' ? 'Tiendas por departamento' : 'Supermercados')

export type V3Rubro = 'Cloud' | 'Licencias' | 'Servicios' | 'Nómina' | 'Amortizaciones'
export const V3_RUBROS: V3Rubro[] = ['Cloud', 'Licencias', 'Servicios', 'Nómina', 'Amortizaciones']

/** `variable`: el rubro tiene componente transaccional (puede justificarse por mayor venta).
 * `tecnico`: rubro contable que el gerente de negocio ve agrupado y con menos prominencia. */
export const V3_RUBRO_META: Record<V3Rubro, { variable: boolean; tecnico: boolean; labelNegocio: string }> = {
  Cloud: { variable: true, tecnico: false, labelNegocio: 'Nube (crece con las transacciones)' },
  Licencias: { variable: false, tecnico: false, labelNegocio: 'Software y licencias' },
  Servicios: { variable: true, tecnico: false, labelNegocio: 'Servicios tecnológicos y soporte' },
  Nómina: { variable: false, tecnico: true, labelNegocio: 'Costos estructurales de TI' },
  Amortizaciones: { variable: false, tecnico: true, labelNegocio: 'Costos estructurales de TI' },
}

export interface V3Servicio {
  servicio: string
  rubro: V3Rubro
  cuentaContable: string
  gerencia: string
  equipo: string
  responsable: string
  /** Peso del servicio dentro del gasto IT de un negocio (suman 1). */
  peso: number
}

export const V3_SERVICIOS: V3Servicio[] = [
  { servicio: 'AWS · Plataforma e-commerce', rubro: 'Cloud', cuentaContable: '6103020 · Servicios de nube', gerencia: 'Infraestructura y Cloud', equipo: 'Cloud Platform', responsable: 'Camila Rojas', peso: 0.1 },
  { servicio: 'Azure · ERP y backoffice', rubro: 'Cloud', cuentaContable: '6103020 · Servicios de nube', gerencia: 'Infraestructura y Cloud', equipo: 'Cloud Platform', responsable: 'Camila Rojas', peso: 0.06 },
  { servicio: 'Google Cloud · Datos', rubro: 'Cloud', cuentaContable: '6103020 · Servicios de nube', gerencia: 'Datos y Analytics', equipo: 'Data Platform', responsable: 'Camila Rojas', peso: 0.04 },
  { servicio: 'Microsoft 365', rubro: 'Licencias', cuentaContable: '6103010 · Licencias de software', gerencia: 'Workplace', equipo: 'Puesto de trabajo', responsable: 'Tomás Herrera', peso: 0.07 },
  { servicio: 'Salesforce Commerce', rubro: 'Licencias', cuentaContable: '6103010 · Licencias de software', gerencia: 'Aplicaciones', equipo: 'Canales digitales', responsable: 'Tomás Herrera', peso: 0.06 },
  { servicio: 'Oracle Retail', rubro: 'Licencias', cuentaContable: '6103010 · Licencias de software', gerencia: 'Aplicaciones', equipo: 'Aplicaciones retail', responsable: 'Tomás Herrera', peso: 0.06 },
  { servicio: 'Mesa de ayuda', rubro: 'Servicios', cuentaContable: '6103030 · Servicios externos TI', gerencia: 'Workplace', equipo: 'Soporte usuarios', responsable: 'Ignacio Vera', peso: 0.07 },
  { servicio: 'Enlaces y comunicaciones', rubro: 'Servicios', cuentaContable: '6103040 · Telecomunicaciones', gerencia: 'Infraestructura y Cloud', equipo: 'Redes', responsable: 'Ignacio Vera', peso: 0.06 },
  { servicio: 'Desarrollo y mantención apps', rubro: 'Servicios', cuentaContable: '6103030 · Servicios externos TI', gerencia: 'Aplicaciones', equipo: 'Canales digitales', responsable: 'Felipe Contreras', peso: 0.08 },
  { servicio: 'Procesamiento de pagos', rubro: 'Servicios', cuentaContable: '6103030 · Servicios externos TI', gerencia: 'Aplicaciones', equipo: 'Aplicaciones retail', responsable: 'Felipe Contreras', peso: 0.05 },
  { servicio: 'Equipo TI interno', rubro: 'Nómina', cuentaContable: '6201010 · Remuneraciones TI', gerencia: 'Gestión TI', equipo: 'Personas TI', responsable: 'Valentina Muñoz', peso: 0.2 },
  { servicio: 'Amortización proyecto Omnicanal', rubro: 'Amortizaciones', cuentaContable: '6301010 · Amortización intangibles', gerencia: 'Arquitectura y Proyectos', equipo: 'PMO', responsable: 'Josefina Lagos', peso: 0.09 },
  { servicio: 'Depreciación equipos de tienda', rubro: 'Amortizaciones', cuentaContable: '6301020 · Depreciación equipos', gerencia: 'Infraestructura y Cloud', equipo: 'Tiendas', responsable: 'Josefina Lagos', peso: 0.06 },
]

export const V3_RESPONSABLES = [...new Set(V3_SERVICIOS.map((s) => s.responsable))].sort((a, b) => a.localeCompare(b, 'es'))

/** Bandera (emoji) de cada país, para chips, tarjetas y filas. */
export const V3_FLAG: Record<V3Pais, string> = { Chile: '🇨🇱', Argentina: '🇦🇷', Perú: '🇵🇪', Colombia: '🇨🇴', Brasil: '🇧🇷' }

/** Costo mensual promedio por persona de TI (USD) — dato de ejemplo para derivar el headcount de la nómina. */
export const V3_COSTO_PERSONA: Record<V3Pais, number> = { Chile: 4200, Argentina: 3100, Perú: 2900, Colombia: 2700, Brasil: 3600 }
