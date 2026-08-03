import { getDestinos, type Servicio } from '@/data/services'

export interface PepN7Row {
  id: string
  pepN7: string
  pais: string
  bandera: string
  centroCosto: string
  pctDistribucion: number
  driver: string
  montoTotal: number
  ultimaEdicion: string
  ultimaEdicionPor: string
}

const EDITORES = ['Ana Martínez', 'Carlos Soto', 'Valentina Cruz', 'Diego Rojas', 'Sofía Herrera']
const DRIVERS = ['Headcount', 'Ingresos', 'Directo']

export function buildPepN7Rows(servicio: Servicio): PepN7Row[] {
  const destinos = getDestinos(servicio)
  const seq = parseInt(servicio.id.replace(/\D/g, ''), 10)

  return destinos.map((d, i) => ({
    id: `${servicio.id}-N7-${i + 1}`,
    pepN7: `${servicio.pep}-${String(i + 1).padStart(2, '0')}`,
    pais: d.pais,
    bandera: servicio.bandera,
    centroCosto: `${servicio.cuentaContable}-${String(seq + i).padStart(3, '0')}`,
    pctDistribucion: d.pct,
    driver: i === 0 ? DRIVERS[seq % DRIVERS.length] : 'Directo',
    montoTotal: Math.round((servicio.totalPlan * d.pct) / 100),
    ultimaEdicion: servicio.ultimaEdicion,
    ultimaEdicionPor: EDITORES[(seq + i) % EDITORES.length],
  }))
}
