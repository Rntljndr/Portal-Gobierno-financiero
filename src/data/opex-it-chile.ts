/** Datos semilla del reporte "OPEX 2026 - IT Chile" (Power BI), capturados en detalle el 13/10/2026 y
 * verificados funcionalmente el mismo día (comportamiento real de los filtros de la página, probado en
 * vivo contra el reporte). Montos en pesos CLP (raw), igual que el resto de los data sets del portal.
 *
 * Los campos `porRubro` (División/Responsable) y `rubro` (Servicio/PEP) no son una estimación: se
 * obtuvieron aplicando el filtro real "Rubro = Servicios" en Power BI y restando contra los totales sin
 * filtrar — todas las cifras resultantes cuadran exactamente contra el total de cada Rubro. */

export type Rubro = 'Servicios' | 'Nómina'

export interface OpexRubroItem {
  nombre: Rubro
  proy: number
  plan: number
}

export interface OpexMonto {
  proy: number
  plan: number
}

export interface OpexDivisionItem {
  nombre: string
  proy: number
  plan: number
  /** Split real por rubro, verificado filtrando el reporte — ausente solo en Áreas Centrales (todo en 0). */
  porRubro?: Record<Rubro, OpexMonto>
}

export interface OpexServicioItem {
  nombre: string
  proy: number
  plan: number
  /** Rubro real del PEP/servicio, verificado viendo qué filas desaparecen al filtrar Rubro = Servicios. */
  rubro: Rubro
  agregado?: boolean
  children?: { nombre: string; proy: number; plan: number }[]
}

export interface OpexResponsableChild {
  cuentaContable: string
  proy: number
  plan: number
}

export interface OpexResponsableItem {
  nombre: string
  proy: number
  plan: number
  children?: OpexResponsableChild[]
  /** Solo Director IT reparte su presupuesto entre ambos rubros — el resto de responsables es 100% Servicios. */
  porRubro?: Record<Rubro, OpexMonto>
}

export interface OpexMesItem {
  mes: string
  plan: number
  proy: number
}

const M = 1_000_000

export const opexRubro: OpexRubroItem[] = [
  { nombre: 'Servicios', proy: 21693.3 * M, plan: 22180.0 * M },
  { nombre: 'Nómina', proy: 8272.1 * M, plan: 8865.0 * M },
]

export const opexDivision: OpexDivisionItem[] = [
  {
    nombre: 'Tiendas por departamento',
    proy: 10349.3 * M,
    plan: 10707.5 * M,
    porRubro: { Servicios: { proy: 7350.1 * M, plan: 7794.6 * M }, Nómina: { proy: 2999.2 * M, plan: 2912.9 * M } },
  },
  {
    nombre: 'Supermercado',
    proy: 12234.4 * M,
    plan: 12542.5 * M,
    porRubro: { Servicios: { proy: 8809.8 * M, plan: 8720.2 * M }, Nómina: { proy: 3424.6 * M, plan: 3822.3 * M } },
  },
  {
    nombre: 'Clientes',
    proy: 1539.8 * M,
    plan: 1849.4 * M,
    porRubro: { Servicios: { proy: 1279.9 * M, plan: 1475.5 * M }, Nómina: { proy: 259.9 * M, plan: 373.9 * M } },
  },
  {
    nombre: 'Mejoramiento del Hogar',
    proy: 5790.5 * M,
    plan: 5853.8 * M,
    porRubro: { Servicios: { proy: 4229.3 * M, plan: 4129.1 * M }, Nómina: { proy: 1561.2 * M, plan: 1724.7 * M } },
  },
  {
    nombre: 'Corporación',
    proy: 6.7 * M,
    plan: 41.8 * M,
    porRubro: { Servicios: { proy: 6.7 * M, plan: 41.8 * M }, Nómina: { proy: 0, plan: 0 } },
  },
  {
    nombre: 'Shopping',
    proy: 44.7 * M,
    plan: 50.0 * M,
    porRubro: { Servicios: { proy: 17.5 * M, plan: 18.8 * M }, Nómina: { proy: 27.2 * M, plan: 31.2 * M } },
  },
  // Existe como opción de filtro en el reporte real pero sin montos asociados (plan y proyectado en 0).
  {
    nombre: 'Áreas Centrales',
    proy: 0,
    plan: 0,
    porRubro: { Servicios: { proy: 0, plan: 0 }, Nómina: { proy: 0, plan: 0 } },
  },
]

export const opexResponsable: OpexResponsableItem[] = [
  { nombre: 'Luis Muñoz', proy: 6665.2 * M, plan: 6334.4 * M },
  { nombre: 'CCT', proy: 2959.6 * M, plan: 2770.3 * M },
  { nombre: 'Gastos sin PEP', proy: 157.2 * M, plan: 0 },
  {
    nombre: 'Christian Rivera',
    proy: 448.4 * M,
    plan: 449.7 * M,
    children: [
      { cuentaContable: 'Eficiencia', proy: 0, plan: -3.0 * M },
      { cuentaContable: 'Alquileres', proy: 0, plan: 0.2 * M },
      { cuentaContable: 'Software Servicio', proy: 272.5 * M, plan: 273.3 * M },
      { cuentaContable: 'Honorarios Profesionales', proy: 175.9 * M, plan: 179.2 * M },
    ],
  },
  { nombre: 'Hipólito Soto', proy: 1666.8 * M, plan: 1682.0 * M },
  { nombre: 'Felipe Pachá', proy: 569.7 * M, plan: 613.4 * M },
  { nombre: 'Orland Vergara', proy: 1001.0 * M, plan: 1049.0 * M },
  { nombre: 'Fernando Rey', proy: 203.4 * M, plan: 268.2 * M },
  { nombre: 'Gastos de Proyectos', proy: 30.3 * M, plan: 168.1 * M },
  {
    nombre: 'Alejandro Castillo',
    proy: 2111.8 * M,
    plan: 2278.7 * M,
    children: [
      { cuentaContable: 'Eficiencia', proy: 0, plan: -170.4 * M },
      { cuentaContable: 'Alquileres', proy: 70.3 * M, plan: 83.9 * M },
      { cuentaContable: 'Software Servicio', proy: 19.5 * M, plan: 40.4 * M },
      { cuentaContable: 'Software', proy: 431.9 * M, plan: 473.7 * M },
      { cuentaContable: 'Honorarios Profesionales', proy: 1590.1 * M, plan: 1851.1 * M },
    ],
  },
  { nombre: 'Teodosio Varela', proy: 4266.7 * M, plan: 4479.3 * M },
  { nombre: 'Kiyoshi Tsukame', proy: 1269.3 * M, plan: 1638.2 * M },
  {
    nombre: 'Director IT',
    proy: 8616.1 * M,
    plan: 9313.8 * M,
    porRubro: { Servicios: { proy: 343.9 * M, plan: 448.8 * M }, Nómina: { proy: 8272.2 * M, plan: 8865.0 * M } },
  },
]

export const opexServicios: OpexServicioItem[] = [
  { nombre: 'Eficiencia Plan 2026', proy: 0, plan: -349.4 * M, rubro: 'Servicios' },
  { nombre: 'Normalización de Puntos Electrónicos', proy: 239.1 * M, plan: 0, rubro: 'Servicios' },
  { nombre: 'Servicio de Soporte Aplicaciones', proy: 192.0 * M, plan: 0, rubro: 'Servicios' },
  { nombre: 'Enlaces Chile', proy: 2244.8 * M, plan: 2064.1 * M, rubro: 'Servicios' },
  { nombre: 'Sin PEP UDN', proy: 123.3 * M, plan: 0, rubro: 'Servicios' },
  { nombre: 'Servicio de Alquileres Cuentas', proy: 232.3 * M, plan: 146.1 * M, rubro: 'Servicios' },
  { nombre: 'Licencias SAS SM CHI', proy: 257.7 * M, plan: 176.7 * M, rubro: 'Servicios' },
  { nombre: 'Mantención lineal de caja', proy: 1346.2 * M, plan: 1268.1 * M, rubro: 'Servicios' },
  { nombre: 'Nómina Retail IT Chile', proy: 430.1 * M, plan: 370.6 * M, rubro: 'Nómina' },
  { nombre: 'Suscripciones Microsoft Azure', proy: 216.0 * M, plan: 157.3 * M, rubro: 'Servicios' },
  { nombre: 'GPI 3952 Soporte forecast', proy: 152.8 * M, plan: 96.2 * M, rubro: 'Servicios' },
  {
    nombre: 'Base Plan 2026',
    proy: 51.5 * M,
    plan: 0,
    rubro: 'Nómina',
    children: [
      { nombre: 'CG-SM-6601-EN-CEE-100', proy: 28.7 * M, plan: 0 },
      { nombre: 'CG-SM-6601-EN-CTP-100', proy: 22.8 * M, plan: 0 },
    ],
  },
  { nombre: 'GPI 4010 Follow plataforma', proy: 68.2 * M, plan: 26.9 * M, rubro: 'Servicios' },
  { nombre: 'AWS_Publicadores Ecommerce', proy: 228.8 * M, plan: 188.7 * M, rubro: 'Servicios' },
  { nombre: 'Shift - Labor', proy: 194.5 * M, plan: 155.0 * M, rubro: 'Servicios' },
  { nombre: 'CELULARES', proy: 37.8 * M, plan: 0.2 * M, rubro: 'Servicios' },
  { nombre: 'Forecast AWS', proy: 207.1 * M, plan: 172.9 * M, rubro: 'Servicios' },
  { nombre: 'Sin PEP Adm Central', proy: 33.9 * M, plan: 0, rubro: 'Servicios' },
  { nombre: 'NÓMINA', proy: 870.6 * M, plan: 839.7 * M, rubro: 'Nómina' },
  { nombre: 'Claude Enterprise Suscripción', proy: 22.8 * M, plan: 0, rubro: 'Servicios' },
  { nombre: 'AWS TxD', proy: 370.6 * M, plan: 347.9 * M, rubro: 'Servicios' },
  { nombre: 'GPI 4952 Consumo WMS Active', proy: 1105.7 * M, plan: 1083.5 * M, rubro: 'Servicios' },
  { nombre: 'AZU-suscripción-AA', proy: 437.6 * M, plan: 415.5 * M, rubro: 'Servicios' },
  { nombre: 'Nuevo servicio por carga de realidad', proy: 17.8 * M, plan: 0, rubro: 'Servicios' },
  { nombre: 'GCP GPI 4876 Arquitectura', proy: 32.3 * M, plan: 17.8 * M, rubro: 'Servicios' },
  { nombre: 'Data Lake Corp BI', proy: 224.0 * M, plan: 211.1 * M, rubro: 'Servicios' },
  { nombre: 'GPI 10485 - Servicio', proy: 25.3 * M, plan: 13.6 * M, rubro: 'Servicios' },
  { nombre: 'OCI Servicio Superior', proy: 55.5 * M, plan: 44.7 * M, rubro: 'Servicios' },
  { nombre: 'Licencia Qualtrics', proy: 24.2 * M, plan: 15.5 * M, rubro: 'Servicios' },
  { nombre: 'AWS GPI 5255 Consumo', proy: 128.0 * M, plan: 119.7 * M, rubro: 'Servicios' },
  // Saldo agregado: el visual original tiene scroll interno y no permite enumerar cada PEP de ahorro
  // individualmente. Se separa en dos filas (Servicios/Nómina) con el monto exacto que le corresponde a
  // cada rubro — calculado restando las líneas ya identificadas contra el total real de cada Rubro.
  { nombre: 'Otros PEP (saldo no desglosado)', proy: 13475.0 * M, plan: 15807.9 * M, rubro: 'Servicios', agregado: true },
  { nombre: 'Otros PEP (saldo no desglosado)', proy: 6919.9 * M, plan: 7654.7 * M, rubro: 'Nómina', agregado: true },
]

export const opexEvolutivoMensual: OpexMesItem[] = [
  { mes: 'Ene', plan: 2514.1 * M, proy: 2187.8 * M },
  { mes: 'Feb', plan: 2451.1 * M, proy: 2256.3 * M },
  { mes: 'Mar', plan: 2667.7 * M, proy: 2544.0 * M },
  { mes: 'Abr', plan: 2609.3 * M, proy: 2369.5 * M },
  { mes: 'May', plan: 2628.5 * M, proy: 2223.3 * M },
  { mes: 'Jun', plan: 2625.9 * M, proy: 2567.5 * M },
  { mes: 'Jul', plan: 2560.7 * M, proy: 2323.9 * M },
  { mes: 'Ago', plan: 2652.0 * M, proy: 2383.5 * M },
  { mes: 'Sep', plan: 2690.0 * M, proy: 2650.3 * M },
  { mes: 'Oct', plan: 2678.5 * M, proy: 2560.8 * M },
  { mes: 'Nov', plan: 2758.1 * M, proy: 2641.8 * M },
  { mes: 'Dic', plan: 2801.0 * M, proy: 2664.7 * M },
]
