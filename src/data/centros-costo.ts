export interface CentroCostoRow {
  id: number
  codigo: string
  tipo: 'Central' | 'Directa'
  driverNomina: string
  driverServicio: string
  driverAmortizacion: string
  pais: string
}

export const centrosCosto: CentroCostoRow[] = [
  { id: 1, codigo: 'CVO0110200', tipo: 'Central', driverNomina: 'Driver Nómina RRHH LATAM', driverServicio: 'Driver Servicios IT', driverAmortizacion: 'Amortizaciones LATAM', pais: 'Regional' },
  { id: 2, codigo: 'CVO0009012', tipo: 'Central', driverNomina: 'Driver Nómina Retail CL', driverServicio: 'Driver Servicios IT', driverAmortizacion: 'Amortizaciones Chile', pais: 'Chile' },
  { id: 3, codigo: 'AWU3007340', tipo: 'Directa', driverNomina: '', driverServicio: '', driverAmortizacion: '', pais: '—' },
  { id: 4, codigo: 'UVO0111200', tipo: 'Central', driverNomina: 'Driver Nómina Tecnología', driverServicio: 'Integraciones', driverAmortizacion: 'Amortización Software', pais: 'Regional' },
  { id: 5, codigo: 'CVO0103100', tipo: 'Central', driverNomina: 'Headcount Digital Factory', driverServicio: 'Datacenter Argentina (Housing)', driverAmortizacion: 'Amortizaciones LATAM', pais: 'Regional' },
  { id: 6, codigo: 'CVO0009400', tipo: 'Central', driverNomina: 'Nómina BO Gerencia', driverServicio: '', driverAmortizacion: '', pais: 'Regional' },
  { id: 7, codigo: 'LFM0007340', tipo: 'Directa', driverNomina: '', driverServicio: '', driverAmortizacion: '', pais: '—' },
  { id: 8, codigo: 'UVO0182200', tipo: 'Central', driverNomina: 'Headcount Operaciones', driverServicio: 'Servicios Generales', driverAmortizacion: 'Depreciación Activos Fijos', pais: 'Argentina' },
  { id: 9, codigo: 'PGOI007332', tipo: 'Central', driverNomina: 'Driver Nómina RRHH LATAM', driverServicio: 'Drivers de PGOI007381', driverAmortizacion: 'Amortizaciones Perú', pais: 'Regional' },
  { id: 10, codigo: 'PGOI007381', tipo: 'Central', driverNomina: 'Driver Nómina RRHH LATAM', driverServicio: 'Drivers de PGOI007381', driverAmortizacion: 'Amortizaciones Perú', pais: 'Regional' },
]
