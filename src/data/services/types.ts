export type EstadoServicio = 'Borrador' | 'Requiere revisión' | 'Enviado' | 'Aprobado'
export type TipoOrigen = 'Nuevo' | 'Recurrente'
export type Pais = 'Argentina' | 'Brasil' | 'Chile' | 'Colombia' | 'Estados Unidos' | 'Perú' | 'Uruguay'

export interface Destino {
  pais: Pais
  pct: number
}

export interface Servicio {
  id: string
  nombre: string
  codigo: string
  pais: Pais
  equipo: string
  moneda: string
  pep: string
  estado: EstadoServicio
  rubro: string
  division: string
  bandera: string
  gerenciaPadre: string
  gerencia: string
  cuentaContable: string
  contrato: string
  totalPlan: number
  forecastBase: number
  forecastIPC: number
  tipoOrigen: TipoOrigen
  ultimaEdicion: string
  destinos?: Destino[]
}
