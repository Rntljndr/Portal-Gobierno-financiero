import type { AnalysisChild, AnalysisGroup } from './types'

function withIpc(nombre: string, plan: number, proy: number): AnalysisChild {
  return { nombre, plan, fBase: proy, fIPC: Math.round(proy * 1.04) }
}

export const divisionData: AnalysisGroup[] = [
  {
    nombre: 'Supermercado',
    children: [
      withIpc('Chile-Central-Sistemas', 16400, 16800),
      withIpc('Argentina-Cencommerce', 12800, 12500),
      withIpc('Brasil-Extra', 9400, 9600),
      withIpc('Colombia-Éxito', 5900, 6100),
    ],
  },
  {
    nombre: 'Mejoramiento del Hogar',
    children: [
      withIpc('Chile-Central-Finanzas', 9500, 9800),
      withIpc('Argentina-MDH-Blaisten', 7400, 7200),
      withIpc('Argentina-MDH-Blaisten Ecommerce', 3900, 4100),
    ],
  },
  {
    nombre: 'Tiendas por departamento',
    children: [
      withIpc('Chile-Central-RRHH', 8200, 8400),
      withIpc('Argentina-Aventura', 5600, 5800),
      withIpc('Colombia-Carulla', 3800, 3900),
    ],
  },
  {
    nombre: 'Retail Financiero',
    children: [
      withIpc('Chile-Clientes-CencoPrime', 7000, 7200),
      withIpc('Argentina-Clientes-Cenco Media', 4600, 4800),
      withIpc('Argentina-Corporación', 3700, 3600),
    ],
  },
]

export const rubroCuentaData: AnalysisGroup[] = [
  {
    nombre: 'Nómina',
    children: [
      withIpc('Sueldos', 27200, 28500),
      withIpc('Bonos', 11800, 12400),
      withIpc('Viáticos y Movilidad', 7500, 7300),
    ],
  },
  {
    nombre: 'Servicios',
    children: [
      withIpc('Software', 20800, 19500),
      withIpc('Software Servicio', 9600, 9800),
      withIpc('Mantenimientos Menores', 7400, 6800),
      withIpc('Telefonía', 4100, 4200),
    ],
  },
  {
    nombre: 'Amortizaciones',
    children: [withIpc('Proyectos', 13500, 14200), withIpc('Trascaja', 7700, 8200)],
  },
]

export const gerenciaEquipoData: AnalysisGroup[] = [
  {
    nombre: 'IT',
    children: [
      withIpc('Governance', 18000, 18500),
      withIpc('Gerencia IT Tech', 12400, 12800),
      withIpc('Productividad', 6800, 7100),
      withIpc('PMO', 9000, 9200),
    ],
  },
  {
    nombre: 'Digital Factory',
    children: [withIpc('Loyalty y Media', 13200, 12800), withIpc('Omnicanalidad', 10200, 9500)],
  },
]
