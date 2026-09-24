import { monthKeys, pepN4Tablon } from '@/data/reporteria'
import { forecastPaisesMoneda } from '@/data/forecast'
import type { ForecastN4Linea, ForecastN7Linea } from '@/data/forecast-lineas'
import { calcLlaveDistribucion } from './forecast-llave'
import { findPlanN4, findPlanN7 } from './forecast-edit-calc'

const MONEDA_POR_PAIS: Record<string, string> = Object.fromEntries(forecastPaisesMoneda.map((p) => [p.pais, p.moneda]))

/** Agrupación Gerencia por Equipo — dato de ejemplo (no existe en el modelo real): junta los equipos
 * técnicos ya existentes en pepN4Tablon bajo gerencias plausibles, para poblar las columnas de
 * identidad copiadas de ForecastN4Historico/N7Historico (F). */
const GERENCIA_POR_EQUIPO: Record<string, string> = {
  Oracle: 'Aplicaciones Corporativas',
  SAP: 'Aplicaciones Corporativas',
  AWS: 'Infraestructura Cloud',
  'Google Cloud': 'Infraestructura Cloud',
  'Azure DevOps': 'Infraestructura Cloud',
  Salesforce: 'CRM y Canales',
  Microsoft: 'Seguridad y Colaboración',
  Cisco: 'Redes y Telecomunicaciones',
  UiPath: 'Automatización',
}

function gerenciaDe(equipo: string): string {
  return GERENCIA_POR_EQUIPO[equipo] ?? 'Tecnología'
}

export interface ForecastIdentidadBase {
  codServicio: string
  pais: string
  moneda: string
  gerenciaPadre: string
  gerencia: string
  equipo: string
  cuentaContable: string
  pep: string
  estado: string
}

/** Identidad de un servicio N4 para las columnas copiadas de ForecastN4Historico (F) — Estado se
 * deriva de datos reales (¿algún N7 hijo quedó en edición manual?), el resto son valores de ejemplo
 * razonables (no hay Gerencia/Cuenta Contable por PEP en el modelo actual). */
export function n4Identidad(n4: ForecastN4Linea): ForecastIdentidadBase {
  const hasManual = n4.n7.some((l) => l.tipoActualizacion === 'manual')
  return {
    codServicio: n4.n4Codigo.replace('N4-', 'SVC-'),
    pais: n4.pais,
    moneda: MONEDA_POR_PAIS[n4.pais] ?? '—',
    gerenciaPadre: 'Tecnología',
    gerencia: gerenciaDe(n4.equipo),
    equipo: n4.equipo,
    cuentaContable: 'OPEX',
    pep: n4.n4Codigo,
    estado: hasManual ? 'Manual' : 'Automático',
  }
}

function findPepN7Seed(n4Codigo: string, n7Codigo: string) {
  return pepN4Tablon.find((n4) => n4.codigo === n4Codigo)?.children.find((n7) => n7.codigo === n7Codigo)
}

export interface ForecastIdentidadN7 extends ForecastIdentidadBase {
  centroCosto: string
  bandera: string
  asignacion: string
  llavePlanPct: number
  llaveForecastPct: number
  motivo: string
  ultimaEdicion: string
}

/** Identidad de un PEP N7 para las columnas copiadas de ForecastN7Historico (F). Estado y las dos
 * Llave de Distribución usan datos reales del propio forecast (tipoActualizacion, y el mismo cálculo
 * de llave que ya distribuye montos automáticos — ver forecast-llave.ts); el resto son de ejemplo. */
export function n7Identidad(n4Codigo: string, n7: ForecastN7Linea, siblings: ForecastN7Linea[], cutoff: number): ForecastIdentidadN7 {
  const seed = findPepN7Seed(n4Codigo, n7.n7Codigo)
  const pais = seed?.pais ?? '—'
  const equipo = seed?.equipo ?? '—'

  const planTotalN7 = monthKeys.reduce((s, k) => s + (findPlanN7(n4Codigo, n7.n7Codigo)[k] || 0), 0)
  const planTotalN4 = monthKeys.reduce((s, k) => s + (findPlanN4(n4Codigo)[k] || 0), 0)
  const llavePlanPct = planTotalN4 > 0 ? (planTotalN7 / planTotalN4) * 100 : 0
  const llaveForecastPct = calcLlaveDistribucion({ n7: siblings }, cutoff).find((l) => l.n7Codigo === n7.n7Codigo)?.pct ?? 0

  const motivo = Object.values(n7.notas).find((n) => n.justificacion)?.justificacion ?? '—'

  return {
    codServicio: n7.n7Codigo.replace('N7-', 'SVC7-'),
    pais,
    moneda: MONEDA_POR_PAIS[pais] ?? '—',
    gerenciaPadre: 'Tecnología',
    gerencia: gerenciaDe(equipo),
    equipo,
    centroCosto: `CC-${n7.n7Codigo.replace(/\D/g, '').padStart(4, '0')}`,
    bandera: 'Corporativo',
    cuentaContable: 'OPEX',
    asignacion: 'Directo',
    llavePlanPct,
    llaveForecastPct,
    pep: n7.n7Codigo,
    estado: n7.tipoActualizacion === 'manual' ? 'Manual' : 'Automático',
    motivo,
    ultimaEdicion: '—',
  }
}
