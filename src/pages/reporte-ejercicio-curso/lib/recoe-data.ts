import { realesN7Rows, monthKeys, type RealesRow } from '@/data/reales'
import { calcMonths, calcTotals, sumTotals, COMPARISON_SERIES, type RealesTotals } from '@/pages/reales/lib/reales-calc'
import { MONEDA_POR_PAIS } from '@/pages/reales/lib/reales-by-country'
import { convertMoneda, paisMoneda, paisTasaCambioPromedio, type Pais } from '@/data/services'
import type { CurrencyView } from '@/data/reporteria'

/** Convierte un monto en moneda local de `pais` a USD usando la misma tasa promedio anual que ya usa
 * el resto del portal (`paisTasaCambioPromedio`) — países sin tasa informada (p.ej. Uruguay, hoy sin
 * PEPs propios en Reales) no se convierten (tasa 1), caso que en la práctica no ocurre con datos reales. */
function toUSD(amount: number, pais: string): number {
  const tasa = (paisTasaCambioPromedio as Record<string, number | undefined>)[pais]
  return tasa ? amount / tasa : amount
}

/** Convierte una fila completa (sus montos mensuales) de su moneda de origen a la de `destino` —
 * matemáticamente equivalente a convertir los totales ya calculados (la conversión es lineal), pero
 * hecho sobre `meses` para que seguir usando `calcTotals`/`calcMonths` sin cambios. Usado por el motor
 * de pivote del Detalle configurable para poder agrupar filas de más de un país sin mezclar monedas. */
export function convertirFilaAMoneda(row: RealesRow, destino: Pais): RealesRow {
  const factor = convertMoneda(1, row.pais as Pais, destino)
  const meses = Object.fromEntries(Object.entries(row.meses).map(([k, v]) => [k, v * factor]))
  return { ...row, meses }
}

/** Mismo factor mock que usa "Reales" para simular el real del año anterior (no existe un histórico
 * real cargado) — ver `COMPARISON_SERIES.anioAnterior` en reales-calc.ts. */
export const ANIO_ANTERIOR_FACTOR = COMPARISON_SERIES.anioAnterior.factor

export const PAISES_CON_REALES = [...new Set(realesN7Rows.map((r) => r.pais))].sort((a, b) => a.localeCompare(b, 'es'))

export function groupBy<T>(rows: T[], keyFn: (r: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>()
  for (const r of rows) {
    const k = keyFn(r)
    if (!m.has(k)) m.set(k, [])
    m.get(k)!.push(r)
  }
  return m
}

export interface PaisResumen {
  pais: string
  moneda: string
  totals: RealesTotals
  realAnioAnterior: number
}

/** Análogo a "Vista General > Indicadores Principales" — una tarjeta por país con Plan/Real/Forecast
 * y el real del año anterior, en la moneda local de cada país (sin consolidar a una moneda común). */
export function resumenPorPais(): PaisResumen[] {
  return PAISES_CON_REALES.map((pais) => {
    const totals = sumTotals(realesN7Rows.filter((r) => r.pais === pais))
    return { pais, moneda: MONEDA_POR_PAIS[pais] ?? pais, totals, realAnioAnterior: totals.real * ANIO_ANTERIOR_FACTOR }
  })
}

/** Mismo comportamiento de moneda que el módulo de Presupuesto (Reporte Tecnología/Negocio):
 * "Origen ML" deja cada país en su propia moneda (sin cambios), "Destino ML" convierte todos los
 * países a la moneda de un país destino elegido, "Destino USD" consolida todo a dólares. Los
 * porcentajes (pctDesvio, desvioAcumPct) no se tocan — son invariantes ante un cambio de moneda lineal. */
export function aplicarVistaMoneda(resumen: PaisResumen[], vista: CurrencyView, paisDestino: Pais | null): PaisResumen[] {
  if (vista === 'origen') return resumen
  const destino: Pais | null = vista === 'dolar' ? 'Estados Unidos' : paisDestino
  if (!destino) return resumen
  const monedaDestino = paisMoneda[destino]
  return resumen.map((r) => {
    const origen = r.pais as Pais
    const conv = (n: number) => convertMoneda(n, origen, destino)
    return {
      ...r,
      moneda: monedaDestino,
      realAnioAnterior: conv(r.realAnioAnterior),
      totals: {
        ...r.totals,
        plan: conv(r.totals.plan),
        real: conv(r.totals.real),
        realMasForecast: conv(r.totals.realMasForecast),
        desvio: conv(r.totals.desvio),
        planAcum: conv(r.totals.planAcum),
        desvioAcumMonto: conv(r.totals.desvioAcumMonto),
      },
    }
  })
}

export interface MesEvolutivo {
  mes: string
  label: string
  plan: number
  real: number
  /** Mismo factor mock `ANIO_ANTERIOR_FACTOR` aplicado mes a mes sobre `real` (no existe un histórico
   * mensual real cargado, igual que `realAnioAnterior` en `resumenPorPais`). */
  anioAnterior: number
}

const MONTH_LABELS: Record<string, string> = {
  ene: 'Ene', feb: 'Feb', mar: 'Mar', abr: 'Abr', may: 'May', jun: 'Jun',
  jul: 'Jul', ago: 'Ago', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dic',
}

// ---------------------------------------------------------------------------
// Vista Ejecutiva — todo consolidado en USD, nunca filtrado por el detalle.
// ---------------------------------------------------------------------------

/** Mismo criterio que `sumTotals` (nunca promedia porcentajes, los recalcula sobre el agregado) pero
 * convirtiendo cada fila a USD antes de sumar — así se pueden agregar filas de distintos países sin
 * mezclar monedas. Usada por todas las piezas de la Vista Ejecutiva. */
export function totalesUSD(rows: RealesRow[]): RealesTotals {
  const acc = rows.reduce(
    (a, r) => {
      const t = calcTotals(r)
      return {
        plan: a.plan + toUSD(t.plan, r.pais),
        real: a.real + toUSD(t.real, r.pais),
        realMasForecast: a.realMasForecast + toUSD(t.realMasForecast, r.pais),
        planAcum: a.planAcum + toUSD(t.planAcum, r.pais),
      }
    },
    { plan: 0, real: 0, realMasForecast: 0, planAcum: 0 },
  )
  const desvio = acc.realMasForecast - acc.plan
  const pctDesvio = acc.plan > 0 ? (desvio / acc.plan) * 100 : 0
  const desvioAcumMonto = acc.real - acc.planAcum
  const desvioAcumPct = acc.planAcum > 0 ? (desvioAcumMonto / acc.planAcum) * 100 : null
  return { ...acc, desvio, pctDesvio, desvioAcumMonto, desvioAcumPct }
}

export interface PaisRankingItem {
  pais: string
  totals: RealesTotals
}

/** Un ítem por país (todos, sin acotar) con sus totales en USD — para el ranking de la Vista Ejecutiva. */
export function rankingPaisesUSD(): PaisRankingItem[] {
  return PAISES_CON_REALES.map((pais) => ({ pais, totals: totalesUSD(realesN7Rows.filter((r) => r.pais === pais)) }))
}

export const RUBROS_CON_REALES = [...new Set(realesN7Rows.map((r) => r.rubro))].sort((a, b) => a.localeCompare(b, 'es'))

export interface RubroResumenItem {
  rubro: string
  totals: RealesTotals
}

/** "¿Cómo vamos por rubro?" — Plan/Real/desvío en USD por cada rubro (OPEX/CAPEX/Servicios/Licencias/
 * Nómina/Amortizaciones), ordenado por mayor plan primero. */
export function resumenPorRubroUSD(): RubroResumenItem[] {
  return RUBROS_CON_REALES.map((rubro) => ({ rubro, totals: totalesUSD(realesN7Rows.filter((r) => r.rubro === rubro)) })).sort(
    (a, b) => b.totals.plan - a.totals.plan,
  )
}

/** Evolutivo mensual Plan vs Real(+Forecast) en USD de un conjunto cualquiera de filas — consolidado
 * (`realesN7Rows`), por país o por rubro, según lo que le pase el selector de la Vista Ejecutiva. */
export function evolutivoMensualUSD(rows: RealesRow[]): MesEvolutivo[] {
  const realPorFila = rows.map((r) => calcMonths(r))
  return monthKeys.map((mes, i) => {
    const plan = rows.reduce((s, r) => s + toUSD(r.meses[mes] || 0, r.pais), 0)
    const real = realPorFila.reduce((s, meses, idx) => s + toUSD(meses[i], rows[idx].pais), 0)
    return { mes, label: MONTH_LABELS[mes], plan, real, anioAnterior: real * ANIO_ANTERIOR_FACTOR }
  })
}
