/** F: mismo vocabulario de "rubro" que los colores de gráficos financieros del design system. "Nómina" y
 * "Amortizaciones" se agregaron para los PEP "sin presupuesto" de reales.ts (Nómina del DF, Amortizaciones),
 * que no encajan en el vocabulario original OPEX/CAPEX/Servicios/Licencias. */
export type PepRubro = 'OPEX' | 'CAPEX' | 'Servicios' | 'Licencias' | 'Nómina' | 'Amortizaciones'

export interface PepN4Meta {
  gerenciaPadre: string
  gerencia: string
  centroCosto: string
  asignacion: 'Directo' | 'Indirecto'
  bandera: string
  cuentaContable: string
  moneda: string
  rubro: PepRubro
  /** Responsable de cuenta — mismo criterio que el resto de esta tabla (dato de gestión ilustrativo). */
  responsableCuenta: string
}

/** Metadata de gestión (gerencias, asignación, bandera, etc.) para cada PEP N4 de `pepN4Tablon`, reutilizada por Reales y Preliminares. */
export const pepN4Meta: Record<string, PepN4Meta> = {
  'N4-2027-001': { gerenciaPadre: 'Tecnología', gerencia: 'IT Operaciones', centroCosto: 'CC-101', asignacion: 'Directo', bandera: 'Cencosud', cuentaContable: 'CA-6001', moneda: 'USD', rubro: 'Servicios', responsableCuenta: 'Marcela Soto' },
  'N4-2027-002': { gerenciaPadre: 'Tecnología', gerencia: 'IT ERP', centroCosto: 'CC-102', asignacion: 'Directo', bandera: 'Cencosud', cuentaContable: 'CA-6100', moneda: 'USD', rubro: 'Licencias', responsableCuenta: 'Marcela Soto' },
  'N4-2027-003': { gerenciaPadre: 'Digital', gerencia: 'E-Commerce', centroCosto: 'CC-201', asignacion: 'Directo', bandera: 'Jumbo', cuentaContable: 'CA-7200', moneda: 'USD', rubro: 'CAPEX', responsableCuenta: 'Rodrigo Pizarro' },
  'N4-2027-004': { gerenciaPadre: 'Operaciones', gerencia: 'Infraestructura', centroCosto: 'CC-301', asignacion: 'Indirecto', bandera: 'Cencosud', cuentaContable: 'CA-5500', moneda: 'USD', rubro: 'OPEX', responsableCuenta: 'Daniela Fuentes' },
  'N4-2027-005': { gerenciaPadre: 'Digital', gerencia: 'Analytics', centroCosto: 'CC-202', asignacion: 'Directo', bandera: 'Paris', cuentaContable: 'CA-7300', moneda: 'COP', rubro: 'Servicios', responsableCuenta: 'Rodrigo Pizarro' },
  'N4-2027-006': { gerenciaPadre: 'Tecnología', gerencia: 'IT Seguridad', centroCosto: 'CC-103', asignacion: 'Indirecto', bandera: 'Cencosud', cuentaContable: 'CA-6200', moneda: 'USD', rubro: 'OPEX', responsableCuenta: 'Marcela Soto' },
  'N4-2027-007': { gerenciaPadre: 'Operaciones', gerencia: 'Supply Chain', centroCosto: 'CC-302', asignacion: 'Directo', bandera: 'Jumbo', cuentaContable: 'CA-5600', moneda: 'BRL', rubro: 'OPEX', responsableCuenta: 'Daniela Fuentes' },
  'N4-2027-008': { gerenciaPadre: 'Digital', gerencia: 'CX Digital', centroCosto: 'CC-203', asignacion: 'Directo', bandera: 'Easy', cuentaContable: 'CA-7400', moneda: 'CLP', rubro: 'CAPEX', responsableCuenta: 'Rodrigo Pizarro' },
  'N4-2027-009': { gerenciaPadre: 'Tecnología', gerencia: 'IT Redes', centroCosto: 'CC-104', asignacion: 'Indirecto', bandera: 'Cencosud', cuentaContable: 'CA-6300', moneda: 'USD', rubro: 'Licencias', responsableCuenta: 'Marcela Soto' },
  'N4-2027-010': { gerenciaPadre: 'Operaciones', gerencia: 'Logística', centroCosto: 'CC-303', asignacion: 'Directo', bandera: 'Cencosud', cuentaContable: 'CA-5700', moneda: 'PEN', rubro: 'OPEX', responsableCuenta: 'Daniela Fuentes' },
}
