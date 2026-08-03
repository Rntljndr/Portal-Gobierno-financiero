export type CurrencyView = 'origen' | 'destino' | 'dolar'

export interface CountryBudget {
  pais: string
  plan: number
  fBase: number
  fIPC: number
  hcPlan: number
  hcForecast: number
  empty?: boolean
}

export interface AnalysisChild {
  nombre: string
  plan: number
  fBase: number
  fIPC: number
}

export interface AnalysisGroup {
  nombre: string
  children: AnalysisChild[]
}

export interface PepN7Row {
  codigo: string
  nombre: string
  pais: string
  paisDestino?: string
  equipo: string
  planFactor: number
  meses: Record<string, number>
}

export interface PepN4Row extends PepN7Row {
  children: PepN7Row[]
}
