export interface JustificacionDesvioCatalogo {
  id: string
  descripcion: string
  presupuesto: boolean
  forecast: boolean
}

export const justificacionesDesvioCatalogo: JustificacionDesvioCatalogo[] = [
  { id: 'j1', descripcion: 'Ajuste Eficiencia Cloud', presupuesto: true, forecast: true },
  { id: 'j2', descripcion: 'Ajuste Tarifa', presupuesto: true, forecast: true },
  { id: 'j3', descripcion: 'AWS', presupuesto: true, forecast: false },
  { id: 'j4', descripcion: 'Baja de Servicio', presupuesto: true, forecast: true },
  { id: 'j5', descripcion: 'Cambio de Cuenta', presupuesto: true, forecast: true },
  { id: 'j6', descripcion: 'Contingencia', presupuesto: true, forecast: true },
  { id: 'j7', descripcion: 'Desvío por estacionalidad', presupuesto: true, forecast: true },
  { id: 'j8', descripcion: 'Desvío Por Sub/Sobre Estimación de Plan', presupuesto: true, forecast: true },
  { id: 'j9', descripcion: 'Desvío x Tipo de Cambio', presupuesto: true, forecast: true },
  { id: 'j10', descripcion: 'Ex Capex', presupuesto: true, forecast: false },
]

export type CentroCostoTipo = 'Central' | 'Directa'

export interface CentroCostoCatalogo {
  id: string
  codigo: string
  tipo: CentroCostoTipo
  activo: boolean
}

export const centrosCostoCatalogo: CentroCostoCatalogo[] = [
  { id: '1234567890', codigo: '1234567890', tipo: 'Central', activo: true },
  { id: 'AAO1007303', codigo: 'AAO1007303', tipo: 'Directa', activo: true },
  { id: 'AAO1007340', codigo: 'AAO1007340', tipo: 'Directa', activo: true },
  { id: 'AAO1007370', codigo: 'AAO1007370', tipo: 'Directa', activo: true },
  { id: 'AAO1007371', codigo: 'AAO1007371', tipo: 'Directa', activo: true },
  { id: 'AAO1007373', codigo: 'AAO1007373', tipo: 'Directa', activo: true },
  { id: 'ACO1007303', codigo: 'ACO1007303', tipo: 'Directa', activo: true },
  { id: 'ACO1007340', codigo: 'ACO1007340', tipo: 'Directa', activo: true },
  { id: 'ACO1007370', codigo: 'ACO1007370', tipo: 'Directa', activo: true },
  { id: 'ACO1007371', codigo: 'ACO1007371', tipo: 'Directa', activo: true },
]

export interface TipoSolicitudAprobador {
  nombre: string
  email: string
}

export interface TipoSolicitudCatalogo {
  id: string
  nombre: string
  descripcion: string
  aprobadores: TipoSolicitudAprobador[]
  activo: boolean
}

const APROBADOR_DEFAULT: TipoSolicitudAprobador = { nombre: 'Andrea Morales', email: 'andrea.morales@cencosud.cl' }

export const tiposSolicitudCatalogo: TipoSolicitudCatalogo[] = [
  { id: 't1', nombre: 'Aumento de Presupuesto', descripcion: 'Incrementa el presupuesto asignado a un PEP ya creado en el sistema.', aprobadores: [APROBADOR_DEFAULT], activo: true },
  { id: 't2', nombre: 'Creación de Nuevo Servicio', descripcion: 'Crea un nuevo PEP de servicio con un presupuesto inicial asignado.', aprobadores: [APROBADOR_DEFAULT], activo: true },
  { id: 't3', nombre: 'Creación de Nuevo Servicio + Traspaso', descripcion: 'Transfiere el presupuesto de un PEP a otro nuevo PEP de servicio con un presupuesto.', aprobadores: [APROBADOR_DEFAULT], activo: true },
  { id: 't4', nombre: 'Liberación de Presupuesto', descripcion: 'Libera fondos disponibles en un PEP existente para su utilización operativa.', aprobadores: [APROBADOR_DEFAULT], activo: true },
  { id: 't5', nombre: "Traspaso entre PEP's", descripcion: 'Transfiere presupuesto de un PEP origen hacia un PEP destino.', aprobadores: [APROBADOR_DEFAULT], activo: true },
]
