import { monthKeys, monthLabelsShort, monthlyBase, pepN4Tablon } from '@/data/reporteria'
import { realesRows, REALES_LAST_CLOSED, REALES_ULTIMO_REAL_LABEL } from '@/data/reales'
import { preliminaresRows, PRELIM_MES_OPEN_LABEL } from '@/data/preliminares'
import { forecastRoundsIniciales } from '@/data/forecast'
import { servicios, convertMoneda } from '@/data/services'

/** País usado para consolidar los montos de servicios (multi-moneda) en la Hero. */
const PAIS_CONSOLIDACION = 'Chile' as const

/** Meses ya cerrados con Real (ene..jul); el mes siguiente está en Preliminar y el resto en Forecast. */
export const CUTOFF_MES = REALES_LAST_CLOSED
export const MES_ABIERTO_LABEL = PRELIM_MES_OPEN_LABEL
export const ULTIMO_REAL_LABEL = REALES_ULTIMO_REAL_LABEL

export type FaseMes = 'real' | 'preliminar' | 'forecast'

export interface MonthProgressPoint {
  mes: string
  label: string
  /** Plan (Reportería), en miles de moneda consolidada. */
  plan: number
  /** Real / Preliminar / Forecast según la fase del mes, en miles de moneda consolidada. */
  valor: number
  fase: FaseMes
}

function sumRealMes(mesIndex: number): number {
  const key = monthKeys[mesIndex]
  return realesRows.reduce((s, row) => s + (row.meses[key] || 0) * row.planFactor, 0)
}

/** Preliminar del mes abierto: `preliminarMes`/`forecastMes` de src/data/preliminares.ts vienen ya multiplicados
 * x1000 respecto de `meses`; se normaliza a la misma unidad (miles) que `monthlyBase` y `realesRows`. */
function sumPreliminarMesAbierto(): number {
  return preliminaresRows.reduce((s, row) => s + (row.preliminarMes || row.forecastMes) / 1000, 0)
}

/** Serie mensual "el proyecto a la fecha": Real en los meses cerrados, Preliminar en el mes en curso de
 * Cierre Contable, y Forecast (con IPC) en los meses aún no abiertos — cruza Reportería + Reales + Preliminares + Forecast. */
export function buildMonthlyProgress(): MonthProgressPoint[] {
  return monthKeys.map((mes, i) => {
    const plan = monthlyBase[i]?.plan ?? 0
    const label = monthLabelsShort[i]
    if (i < CUTOFF_MES) return { mes, label, plan, valor: sumRealMes(i), fase: 'real' as const }
    if (i === CUTOFF_MES) return { mes, label, plan, valor: sumPreliminarMesAbierto(), fase: 'preliminar' as const }
    return { mes, label, plan, valor: monthlyBase[i]?.fIPC ?? 0, fase: 'forecast' as const }
  })
}

export interface ReportingKpis {
  points: MonthProgressPoint[]
  planAnualK: number
  forecastIPCAnualK: number
  planYTDK: number
  realYTDK: number
  desvioForecastPct: number
  avancePct: number
  n4Count: number
  activeRoundTitulo: string
  activeRoundDesvio: number
}

/** KPIs de la home combinando Reportería (plan/forecast anual), Forecast (ronda activa) y Reales (ejecutado a la fecha). */
export function computeReportingKpis(): ReportingKpis {
  const points = buildMonthlyProgress()
  const planAnualK = monthlyBase.reduce((s, d) => s + d.plan, 0)
  const forecastIPCAnualK = monthlyBase.reduce((s, d) => s + d.fIPC, 0)
  const planYTDK = monthlyBase.slice(0, CUTOFF_MES).reduce((s, d) => s + d.plan, 0)
  const realYTDK = points.filter((p) => p.fase === 'real').reduce((s, p) => s + p.valor, 0)
  const desvioForecastPct = planAnualK > 0 ? ((forecastIPCAnualK - planAnualK) / planAnualK) * 100 : 0
  const avancePct = planYTDK > 0 ? (realYTDK / planYTDK) * 100 : 0
  const activeRound = forecastRoundsIniciales.find((r) => r.estado === 'Abierto') ?? forecastRoundsIniciales[0]
  return {
    points,
    planAnualK,
    forecastIPCAnualK,
    planYTDK,
    realYTDK,
    desvioForecastPct,
    avancePct,
    n4Count: pepN4Tablon.length,
    activeRoundTitulo: activeRound?.titulo ?? '',
    activeRoundDesvio: activeRound?.desvio ?? 0,
  }
}

export interface HeroStats {
  pendientes: number
  enviados: number
  aprobados: number
  totalLineas: number
  /** Suma de totalPlan de Mis Servicios, convertida a la moneda de PAIS_CONSOLIDACION. */
  montoTotalConsolidado: number
}

/** Estadísticas de "Ejercicio en planificación" (Mis Servicios) para la Hero. */
export function computeHeroStats(): HeroStats {
  const pendientes = servicios.filter((s) => s.estado === 'Borrador' || s.estado === 'Requiere revisión').length
  const enviados = servicios.filter((s) => s.estado === 'Enviado').length
  const aprobados = servicios.filter((s) => s.estado === 'Aprobado').length
  const montoTotalConsolidado = servicios.reduce((s, sv) => s + convertMoneda(sv.totalPlan, sv.pais, PAIS_CONSOLIDACION), 0)
  return { pendientes, enviados, aprobados, totalLineas: servicios.length, montoTotalConsolidado }
}
