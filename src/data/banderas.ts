export interface BanderaRow {
  id: number
  desc: string
  codigo: string
  pais: string
  division: string
  visible: boolean
  estado: 'activo' | 'inactivo'
}

export const paisesBandera = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú']

export const paisFlagBandera: Record<string, string> = {
  Argentina: '🇦🇷', Brasil: '🇧🇷', Chile: '🇨🇱', Colombia: '🇨🇴', Perú: '🇵🇪',
}

export const divisiones = ['Supermercados', 'Tiendas por Departamento', 'Mejoramiento del Hogar', 'Servicios Financieros', 'Centros Comerciales', 'Corporativo']

export const banderas: BanderaRow[] = [
  { id: 1, desc: 'Argentina-Aventura', codigo: 'AAO', pais: 'Argentina', division: 'Tiendas por Departamento', visible: true, estado: 'activo' },
  { id: 2, desc: 'Argentina-Cencommerce', codigo: 'AVO', pais: 'Argentina', division: 'Servicios Financieros', visible: true, estado: 'activo' },
  { id: 3, desc: 'Argentina-Central-Finanzas', codigo: 'AGF', pais: 'Argentina', division: 'Corporativo', visible: false, estado: 'inactivo' },
  { id: 4, desc: 'Argentina-Central-OLLA', codigo: 'AQO', pais: 'Chile', division: 'Corporativo', visible: true, estado: 'activo' },
  { id: 5, desc: 'Argentina-Central-RRHH', codigo: 'AGR', pais: 'Argentina', division: 'Corporativo', visible: true, estado: 'activo' },
  { id: 6, desc: 'Argentina-Central-Sistemas', codigo: 'AOO', pais: 'Argentina', division: 'Corporativo', visible: true, estado: 'activo' },
  { id: 7, desc: 'Argentina-Clientes-Cenco Media', codigo: 'AFD', pais: 'Argentina', division: 'Servicios Financieros', visible: true, estado: 'activo' },
  { id: 8, desc: 'Argentina-Clientes-CencoPrime', codigo: 'AFM', pais: 'Argentina', division: 'Servicios Financieros', visible: true, estado: 'activo' },
  { id: 9, desc: 'Argentina-Corporación', codigo: 'AGC', pais: 'Argentina', division: 'Corporativo', visible: true, estado: 'activo' },
  { id: 10, desc: 'Argentina-MDH-Blaisten', codigo: 'AEB', pais: 'Argentina', division: 'Mejoramiento del Hogar', visible: true, estado: 'activo' },
  { id: 11, desc: 'Chile-MDH-Easy', codigo: 'CEE', pais: 'Chile', division: 'Mejoramiento del Hogar', visible: true, estado: 'activo' },
  { id: 12, desc: 'Chile-Clientes-Fidelidad', codigo: 'CFD', pais: 'Chile', division: 'Servicios Financieros', visible: true, estado: 'activo' },
  { id: 13, desc: 'Chile-SM-Jumbo', codigo: 'CSJ', pais: 'Chile', division: 'Supermercados', visible: true, estado: 'activo' },
  { id: 14, desc: 'Chile-TXD-París', codigo: 'CTP', pais: 'Chile', division: 'Tiendas por Departamento', visible: true, estado: 'activo' },
  { id: 15, desc: 'Chile-SM-Santa Isabel', codigo: 'CSI', pais: 'Chile', division: 'Supermercados', visible: false, estado: 'inactivo' },
  { id: 16, desc: 'Perú-SM-Wong', codigo: 'PWN', pais: 'Perú', division: 'Supermercados', visible: true, estado: 'activo' },
  { id: 17, desc: 'Perú-SM-Metro', codigo: 'PMT', pais: 'Perú', division: 'Supermercados', visible: true, estado: 'activo' },
  { id: 18, desc: 'Colombia-MDH-Easy', codigo: 'COE', pais: 'Colombia', division: 'Mejoramiento del Hogar', visible: true, estado: 'activo' },
  { id: 19, desc: 'Colombia-SM-Jumbo', codigo: 'COJ', pais: 'Colombia', division: 'Supermercados', visible: false, estado: 'inactivo' },
  { id: 20, desc: 'Brasil-SM-GBarbosa', codigo: 'BGB', pais: 'Brasil', division: 'Supermercados', visible: true, estado: 'activo' },
]
