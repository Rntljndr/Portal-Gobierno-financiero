export interface PaisCatalogo {
  id: string
  codigo: string
  nombre: string
  moneda: string
  activo: boolean
}

export const paisesCatalogo: PaisCatalogo[] = [
  { id: 'AG', codigo: 'AG', nombre: 'Argentina', moneda: 'ARS', activo: true },
  { id: 'BG', codigo: 'BG', nombre: 'Brasil', moneda: 'BRL', activo: true },
  { id: 'CG', codigo: 'CG', nombre: 'Chile', moneda: 'CLP', activo: true },
  { id: 'EG', codigo: 'EG', nombre: 'Estados Unidos', moneda: 'USD', activo: true },
  { id: 'LG', codigo: 'LG', nombre: 'Colombia', moneda: 'COP', activo: true },
  { id: 'PG', codigo: 'PG', nombre: 'Perú', moneda: 'PEN', activo: true },
  { id: 'UG', codigo: 'UG', nombre: 'Uruguay', moneda: 'UYU', activo: true },
]

export const monedaOpciones = ['ARS', 'BRL', 'CLP', 'COP', 'PEN', 'USD', 'UYU']

export interface AreaCatalogo {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  pais: string
  activo: boolean
}

export const areasCatalogo: AreaCatalogo[] = [
  { id: 'OA-AG', codigo: 'OA', nombre: 'Operaciones', descripcion: 'Área de operaciones y logística', pais: 'Argentina', activo: true },
  { id: 'OA-CG', codigo: 'OA', nombre: 'Operaciones', descripcion: 'Área de operaciones y logística', pais: 'Chile', activo: true },
  { id: 'SI-AG', codigo: 'SI', nombre: 'Seguridad Informática', descripcion: 'Área de seguridad informática', pais: 'Argentina', activo: true },
  { id: 'SI-CG', codigo: 'SI', nombre: 'Seguridad Informática', descripcion: 'Área de seguridad informática', pais: 'Chile', activo: true },
  { id: 'TD-AG', codigo: 'TD', nombre: 'TxD', descripcion: 'Área de transformación digital', pais: 'Argentina', activo: true },
  { id: 'TD-BG', codigo: 'TD', nombre: 'TxD', descripcion: 'Área de transformación digital', pais: 'Brasil', activo: true },
  { id: 'VO-CG', codigo: 'VO', nombre: 'Cencommerce', descripcion: 'Área de comercio electrónico', pais: 'Chile', activo: true },
  { id: 'VO-LG', codigo: 'VO', nombre: 'Cencommerce', descripcion: 'Área de comercio electrónico', pais: 'Colombia', activo: true },
  { id: 'PM-AG', codigo: 'PM', nombre: 'PMO-Licenciamiento', descripcion: 'Área de licenciamiento y PMO', pais: 'Argentina', activo: true },
  { id: 'BO-AG', codigo: 'BO', nombre: 'Back Office', descripcion: 'Área de soporte administrativo', pais: 'Argentina', activo: true },
  { id: 'BO-PG', codigo: 'BO', nombre: 'Back Office', descripcion: 'Área de soporte administrativo', pais: 'Perú', activo: true },
  { id: 'SM-CG', codigo: 'SM', nombre: 'SM', descripcion: 'Área de supermercados', pais: 'Chile', activo: true },
]

export const paisOpciones = paisesCatalogo.map((p) => p.nombre)

export interface DivisionCatalogo {
  id: string
  codigo: string
  nombre: string
  activo: boolean
}

export const divisionesCatalogo: DivisionCatalogo[] = [
  { id: 'AREAS_CENTRALES', codigo: 'AREAS_CENTRALES', nombre: 'Areas Centrales', activo: true },
  { id: 'AVENTURA', codigo: 'AVENTURA', nombre: 'Aventura', activo: true },
  { id: 'CENCOMMERCE', codigo: 'CENCOMMERCE', nombre: 'Cencommerce', activo: true },
  { id: 'CLIENTES', codigo: 'CLIENTES', nombre: 'Clientes', activo: true },
  { id: 'CORPORACION', codigo: 'CORPORACION', nombre: 'Corporación', activo: true },
  { id: 'DESARROLLO_DE_NEGOCIO', codigo: 'DESARROLLO_DE_NEGOCIO', nombre: 'Desarrollo de Negocio', activo: true },
  { id: 'INACTIVA', codigo: 'INACTIVA', nombre: 'INACTIVA', activo: true },
  { id: 'MEDIOS_DE_PAGO', codigo: 'MEDIOS_DE_PAGO', nombre: 'Medios de Pago', activo: true },
  { id: 'MEJORAMIENTO_DEL_HOGAR', codigo: 'MEJORAMIENTO_DEL_HOGAR', nombre: 'Mejoramiento del Hogar', activo: true },
  { id: 'RETAIL_FINANCIERO', codigo: 'RETAIL_FINANCIERO', nombre: 'Retail Financiero', activo: true },
]

export interface CuentaContableCatalogo {
  id: string
  codigo: string
  nombre: string
  rubro: string
  tipo: string
  activo: boolean
}

export const rubroOpciones = ['Servicios', 'Amortización', 'Nómina']
export const tipoCuentaOpciones = ['Egresos', 'Ingresos']

export const cuentasContablesCatalogo: CuentaContableCatalogo[] = [
  { id: 'A', codigo: '-A', nombre: 'FALTA CARGAR CUENTA CONTABLE', rubro: 'Servicios', tipo: 'Egresos', activo: false },
  { id: 'AL', codigo: 'AL', nombre: 'Alquileres', rubro: 'Servicios', tipo: 'Egresos', activo: true },
  { id: 'AM', codigo: 'AM', nombre: 'Amortizaciones', rubro: 'Amortización', tipo: 'Egresos', activo: true },
  { id: 'CD', codigo: 'CD', nombre: 'Comunicación de Datos', rubro: 'Servicios', tipo: 'Egresos', activo: true },
  { id: 'EF', codigo: 'EF', nombre: 'Eficiencia', rubro: 'Servicios', tipo: 'Egresos', activo: true },
  { id: 'EN', codigo: 'EN', nombre: 'Eficiencia Nomina', rubro: 'Nómina', tipo: 'Egresos', activo: true },
  { id: 'FC', codigo: 'FC', nombre: 'Facturación', rubro: 'Servicios', tipo: 'Egresos', activo: true },
  { id: 'GC', codigo: 'GC', nombre: 'Gasto Común', rubro: 'Servicios', tipo: 'Egresos', activo: true },
  { id: 'GG', codigo: 'GG', nombre: 'Gastos Generales', rubro: 'Servicios', tipo: 'Egresos', activo: true },
  { id: 'GP', codigo: 'GP', nombre: 'Proyectos', rubro: 'Servicios', tipo: 'Egresos', activo: true },
]

export interface DestinoCatalogo {
  id: string
  destino: string
  codigo: string
  activo: boolean
}

export const destinosCatalogo: DestinoCatalogo[] = [
  { id: 'ECO', destino: 'Desconocido', codigo: 'ECO', activo: true },
  { id: '000', destino: 'Distinto país origen destino (Corporación)', codigo: '000', activo: true },
  { id: '574', destino: 'FALTA CARGAR DESTINO', codigo: '574', activo: false },
  { id: '400', destino: 'FALTA CARGAR DESTINO', codigo: '400', activo: false },
  { id: '510', destino: 'FALTA CARGAR DESTINO', codigo: '510', activo: false },
  { id: 'CNS', destino: 'FALTA CARGAR DESTINO', codigo: 'CNS', activo: false },
  { id: '894', destino: 'FALTA CARGAR DESTINO', codigo: '894', activo: false },
  { id: '511', destino: 'FALTA CARGAR DESTINO', codigo: '511', activo: false },
  { id: '506', destino: 'FALTA CARGAR DESTINO', codigo: '506', activo: false },
]
