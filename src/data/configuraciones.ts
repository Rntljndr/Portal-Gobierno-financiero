export const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export interface PaisCotizacion {
  name: string
  moneda: string
}

export const paisesCotizacion: PaisCotizacion[] = [
  { name: 'Argentina', moneda: 'ARS' },
  { name: 'Brasil', moneda: 'BRL' },
  { name: 'Chile', moneda: 'CLP' },
  { name: 'Colombia', moneda: 'COP' },
  { name: 'Estados Unidos', moneda: 'USD' },
  { name: 'Perú', moneda: 'PEN' },
  { name: 'Uruguay', moneda: 'UYU' },
]

export const paisesIpc = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Estados Unidos', 'Perú', 'Uruguay']

export type CotizacionesPorPais = Record<string, Record<string, string>>
export type IpcPorPais = Record<string, string>

export function buildEmptyCotizaciones(): CotizacionesPorPais {
  return Object.fromEntries(paisesCotizacion.map((p) => [p.name, Object.fromEntries(meses.map((m) => [m, '0']))]))
}

export function buildEmptyIpc(): IpcPorPais {
  return Object.fromEntries(paisesIpc.map((p) => [p, '0']))
}
