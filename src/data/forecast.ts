import { pepN4Tablon } from './reporteria'

export type ForecastEstado = 'Borrador' | 'Abierto' | 'Cerrado'
export type ForecastTipo = 'global' | 'parcial'

export interface ForecastRound {
  id: string
  titulo: string
  descripcion: string
  tipo: ForecastTipo
  estado: ForecastEstado
  cerradoManual: boolean
  fechaInicio: string
  fechaTermino: string
  desvio: number
  pepsCount: number | null
}

export const forecastRoundsIniciales: ForecastRound[] = [
  { id: 'F1_2026', titulo: 'Forecast 1 — 2026', descripcion: '', tipo: 'global', estado: 'Cerrado', cerradoManual: false, fechaInicio: '2026-01-01', fechaTermino: '2026-03-31', desvio: 2.5, pepsCount: null },
  { id: 'F2_2026', titulo: 'Forecast 2 — 2026', descripcion: '', tipo: 'global', estado: 'Abierto', cerradoManual: false, fechaInicio: '2026-04-01', fechaTermino: '2026-08-31', desvio: 3.0, pepsCount: null },
  { id: 'F3_2026', titulo: 'Forecast Parcial — Proyectos TI', descripcion: 'Seguimiento acotado de proyectos de tecnología en curso', tipo: 'parcial', estado: 'Borrador', cerradoManual: false, fechaInicio: '2026-07-01', fechaTermino: '2026-09-30', desvio: 1.5, pepsCount: 4 },
]

export interface ForecastPep {
  codigo: string
  nombre: string
  pais: string
  area: string
  cuenta: string
}

export const forecastPepList: ForecastPep[] = pepN4Tablon.map((n4) => ({ codigo: n4.codigo, nombre: n4.nombre, pais: n4.pais, area: n4.equipo, cuenta: 'OPEX' }))

export const forecastMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
/** Índice (0-based) del primer mes proyectado; los meses anteriores ya tienen tasa real cerrada. */
export const FORECAST_MES_ACTUAL = 7

export const forecastPaisesMoneda = [
  { pais: 'Argentina', moneda: 'ARS' },
  { pais: 'Brasil', moneda: 'BRL' },
  { pais: 'Chile', moneda: 'CLP' },
  { pais: 'Colombia', moneda: 'COP' },
  { pais: 'Perú', moneda: 'PEN' },
  { pais: 'Uruguay', moneda: 'UYU' },
  { pais: 'Regional', moneda: 'USD' },
]

export const forecastTasasHistoricas: Record<string, number[]> = {
  ARS: [1162, 1184, 1203, 1218, 1231, 1245, 1258],
  BRL: [5.12, 5.18, 5.22, 5.28, 5.31, 5.35, 5.38],
  CLP: [953, 961, 969, 948, 944, 951, 958],
  COP: [4120, 4155, 4180, 4210, 4240, 4265, 4290],
  PEN: [3.78, 3.8, 3.82, 3.81, 3.83, 3.85, 3.84],
  UYU: [39.2, 39.6, 40.1, 40.4, 40.8, 41.2, 41.5],
  USD: [1, 1, 1, 1, 1, 1, 1],
}
