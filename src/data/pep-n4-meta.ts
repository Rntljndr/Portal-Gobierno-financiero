export interface PepN4Meta {
  gerenciaPadre: string
  gerencia: string
  centroCosto: string
  asignacion: 'Directo' | 'Indirecto'
  bandera: string
  cuentaContable: string
  moneda: string
}

/** Metadata de gestión (gerencias, asignación, bandera, etc.) para cada PEP N4 de `pepN4Tablon`, reutilizada por Reales y Preliminares. */
export const pepN4Meta: Record<string, PepN4Meta> = {
  'N4-2027-001': { gerenciaPadre: 'Tecnología', gerencia: 'IT Operaciones', centroCosto: 'CC-101', asignacion: 'Directo', bandera: 'Cencosud', cuentaContable: 'CA-6001', moneda: 'USD' },
  'N4-2027-002': { gerenciaPadre: 'Tecnología', gerencia: 'IT ERP', centroCosto: 'CC-102', asignacion: 'Directo', bandera: 'Cencosud', cuentaContable: 'CA-6100', moneda: 'USD' },
  'N4-2027-003': { gerenciaPadre: 'Digital', gerencia: 'E-Commerce', centroCosto: 'CC-201', asignacion: 'Directo', bandera: 'Jumbo', cuentaContable: 'CA-7200', moneda: 'USD' },
  'N4-2027-004': { gerenciaPadre: 'Operaciones', gerencia: 'Infraestructura', centroCosto: 'CC-301', asignacion: 'Indirecto', bandera: 'Cencosud', cuentaContable: 'CA-5500', moneda: 'USD' },
  'N4-2027-005': { gerenciaPadre: 'Digital', gerencia: 'Analytics', centroCosto: 'CC-202', asignacion: 'Directo', bandera: 'Paris', cuentaContable: 'CA-7300', moneda: 'COP' },
  'N4-2027-006': { gerenciaPadre: 'Tecnología', gerencia: 'IT Seguridad', centroCosto: 'CC-103', asignacion: 'Indirecto', bandera: 'Cencosud', cuentaContable: 'CA-6200', moneda: 'USD' },
  'N4-2027-007': { gerenciaPadre: 'Operaciones', gerencia: 'Supply Chain', centroCosto: 'CC-302', asignacion: 'Directo', bandera: 'Jumbo', cuentaContable: 'CA-5600', moneda: 'BRL' },
  'N4-2027-008': { gerenciaPadre: 'Digital', gerencia: 'CX Digital', centroCosto: 'CC-203', asignacion: 'Directo', bandera: 'Easy', cuentaContable: 'CA-7400', moneda: 'CLP' },
  'N4-2027-009': { gerenciaPadre: 'Tecnología', gerencia: 'IT Redes', centroCosto: 'CC-104', asignacion: 'Indirecto', bandera: 'Cencosud', cuentaContable: 'CA-6300', moneda: 'USD' },
  'N4-2027-010': { gerenciaPadre: 'Operaciones', gerencia: 'Logística', centroCosto: 'CC-303', asignacion: 'Directo', bandera: 'Cencosud', cuentaContable: 'CA-5700', moneda: 'PEN' },
}
